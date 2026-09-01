// server/api/v1/ai/interpret.post.ts
import Anthropic from "@anthropic-ai/sdk";
import * as z from "zod";
import { ChartShapeSchema, ChartSpecSchema } from "~/lib/schema";
import { requireUser } from "~~/server/utils/auth";
import { prisma } from "~~/server/utils/prisma";

const FREE_LIMIT = 25;
const WINDOW_MS = 1000 * 60 * 60 * 24;

// Cap input size — data parsing is unbounded, so protect against someone
// pasting a 50k-row CSV and running up a huge token bill.
const MAX_INPUT_CHARS = 8000;

const SYSTEM = `You convert raw tabular data into a PointViz chart spec. Produce ONLY valid JSON \
matching this shape:
{
  "type": "bar" | "line" | "area",
  "orientation": "vertical" | "horizontal" (optional),
  "stack": boolean (optional),
  "title": string (optional — a short headline stating the takeaway),
  "subtitle": string (optional — the metric or units),
  "categories": string[],
  "series": [{ "name": string, "values": number[] }]
}

Rules:
- Each series' "values" array MUST have exactly one number per category, in the same order.
- Use ONLY the numbers present in the data — never invent, estimate, or fill missing values.
- Infer the shape: wide format (first column = categories, other columns = series) is most common,
  but handle long format (category/series/value triples) by pivoting into series.
- Choose the chart type that fits: line/area for time trends, bar for category comparisons.
- Strip formatting from numbers ("1,234" → 1234, "45%" → 45).
- Respond with ONLY the JSON, no prose, no markdown fences.`;

function stripFences(text: string): string {
	return text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

export default defineEventHandler(async (event) => {
	// ── Gate ──
	const authUser = await requireUser(event);

	// ── Meter (shared with customize — same allowance) ──
	const me = await prisma.user.findUnique({
		where: { id: authUser.id },
		select: { plan: true, customizeCount: true, customizeResetAt: true },
	});
	if (!me) throw createError({ statusCode: 404, statusMessage: "Account not found." });

	const now = Date.now();
	let count = me.customizeCount;
	if (now - me.customizeResetAt.getTime() > WINDOW_MS) {
		count = 0;
		await prisma.user.update({
			where: { id: authUser.id },
			data: { customizeCount: 0, customizeResetAt: new Date() },
		});
	}
	if (me.plan === "FREE" && count >= FREE_LIMIT) {
		throw createError({
			statusCode: 429,
			statusMessage: "You've hit your free limit. Upgrade for unlimited.",
		});
	}

	// ── Input ──
	const { data } = await readBody<{ data?: string }>(event);
	if (!data?.trim()) {
		throw createError({ statusCode: 400, statusMessage: "data is required" });
	}
	if (data.length > MAX_INPUT_CHARS) {
		throw createError({
			statusCode: 413,
			statusMessage: `Data too large (max ${MAX_INPUT_CHARS} characters). Trim it or use the JSON tab.`,
		});
	}

	const config = useRuntimeConfig();
	const client = new Anthropic({ apiKey: config.anthropicApiKey });

	const messages: Anthropic.MessageParam[] = [
		{ role: "user", content: `Convert this data into a chart spec:\n\n${data}` },
	];

	for (let attempt = 0; attempt <= 2; attempt++) {
		const res = await client.messages.create({
			model: config.customizeModel,
			max_tokens: 2048,
			system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
			messages,
		});

		const block = res.content.find((b) => b.type === "text");
		const raw = stripFences(block && "text" in block ? block.text : "");

		let parsed: z.infer<typeof ChartSpecSchema> | null = null;
		let parseError: string | null = null;
		try {
			const result = ChartSpecSchema.safeParse(JSON.parse(raw));
			if (result.success) parsed = result.data;
			else parseError = z.prettifyError(result.error);
		} catch {
			parseError = "That was not valid JSON. Respond with ONLY the JSON spec.";
		}

		if (parsed) {
			// Charge one — only on success.
			await prisma.user.update({
				where: { id: authUser.id },
				data: { customizeCount: { increment: 1 } },
			});
			return { spec: parsed, raw: JSON.stringify(parsed, null, 2) };
		}

		messages.push({ role: "assistant", content: raw });
		messages.push({ role: "user", content: `${parseError}\n\nReturn a corrected spec.` });
	}

	throw createError({
		statusCode: 422,
		statusMessage: "Couldn't read that data. Try the JSON tab, or reformat it.",
	});
});