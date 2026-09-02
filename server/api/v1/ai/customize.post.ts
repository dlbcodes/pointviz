// server/api/v1/ai/customize.post.ts
import Anthropic from "@anthropic-ai/sdk";
import * as z from "zod";
import { ChartSpecSchema, type ChartSpec } from "~/lib/schema";
import { THEME_NAMES, PALETTE_NAMES } from "~/lib/theme";
import { requireUser } from "~~/server/utils/auth";
import { prisma } from "~~/server/utils/prisma";
import { PLANS } from "~~/shared/plans";

const HEX = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);

// The model returns ONLY the fields that change — never the whole spec.
const PatchSchema = z.object({
	type: z.enum(["bar", "line", "area"]).optional(),
	orientation: z.enum(["vertical", "horizontal"]).optional(),
	stack: z.boolean().optional(),
	title: z.string().optional(),
	subtitle: z.string().optional(),
	source: z.string().optional(),
	goals: z.array(z.object({
		value: z.number(),
		label: z.string().optional(),
		color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).optional(),
	})).optional(),
	style: z
		.object({
			theme: z.enum(THEME_NAMES as [string, ...string[]]).optional(),
			palette: z.enum(PALETTE_NAMES as [string, ...string[]]).optional(),
			colors: z.array(HEX).optional(),
			gridColor: HEX.optional(),
			backgroundColor: HEX.optional(),
			title: z.object({
				size: z.enum(["sm", "md", "lg", "xl"]).optional(),
				color: HEX.optional(),
			}).optional(),
			subtitle: z.object({
				size: z.enum(["sm", "md", "lg", "xl"]).optional(),
				color: HEX.optional(),
			}).optional(),
			showValues: z.union([
				z.boolean(),
				z.object({
					show: z.boolean().optional(),
					position: z.enum(["inside", "top", "right", "left", "bottom"]).optional(),
					color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).optional(),
				}),
			]).optional(),
			legend: z
				.object({
					visible: z.boolean().optional(),
					position: z.enum(["top", "bottom", "left", "right"]).optional(),
				})
				.optional(),
			xAxis: z.object({
				visible: z.boolean().optional(),
				label: z.string().optional(),
				position: z.enum(["left", "right"]).optional(),
			}).optional(),
			yAxis: z.object({
				visible: z.boolean().optional(),
				label: z.string().optional(),
				position: z.enum(["left", "right"]).optional(),
			}).optional(),
		})
		.optional(),
});

const SYSTEM = `You translate a natural-language instruction into a PATCH for a chart — a small \
object containing ONLY the fields that should change. Do NOT return the whole chart. Do NOT \
include fields the instruction doesn't touch.

Examples:
- "make the bars #e11d48 and #0ea5e9" → { "style": { "colors": ["#e11d48", "#0ea5e9"] } }
- "use the datapoint theme" → { "style": { "theme": "datapoint" } }
- "colorblind friendly" → { "style": { "palette": "colorblind-safe" } }
- "make it horizontal and stacked" → { "orientation": "horizontal", "stack": true }
- "show the values and put the legend on top" → { "style": { "showValues": true, "legend": { "position": "top" } } }
- "lighten the grid to #eeeeee" → { "style": { "gridColor": "#eeeeee" } }
- "set the background to light gray" → { "style": { "backgroundColor": "#dddddd" } }
- "make the title bigger" → { "style": { "title": { "size": "lg" } } }
- "add a goal line at 50000 labeled Target" → { "goals": [{ "value": 50000, "label": "Target" }] }
- "move the y-axis to the right" → { "style": { "yAxis": { "position": "right" } } }
- "remove the goal line" → { "goals": [] }

Fields you may patch:
- type (bar/line/area), orientation (vertical/horizontal), stack, title, subtitle, source
- style.theme: ${THEME_NAMES.join(", ")}
- style.palette: ${PALETTE_NAMES.join(", ")} (series colors only)
- style.colors: array of hex (specific colors)
- style.gridColor: single hex
- style.backgroundColor: single hex (chart background)
- style.showValues: boolean
- style.legend: { visible, position }
- style.xAxis / style.yAxis: { visible, label }
- style.title / style.subtitle: { size (sm/md/lg/xl), color (hex) } — these control the APPEARANCE of the title/subtitle. The top-level "title"/"subtitle" fields are the TEXT itself. "make the title bigger" → style.title.size; "rename the title to X" → title.
- style.showValues: true/false, OR { show, position (inside/top/right/left/bottom), color (hex) } for label placement and color
- goals: array of { value (number), label (optional), color (optional hex) } — horizontal target/reference lines at a value. Replaces existing goals.
- style.yAxis.position / style.xAxis.position: "left" or "right" — which side the axis sits on.

Resolve vague color names (e.g. "light gray", "navy") to a reasonable hex value.
Never change the data (categories, series, values). Emit only what the instruction requires.
Respond with ONLY the JSON patch object — no prose, no markdown fences, nothing else.
`;

// Shallow-merge, merging `style` one level deep so a color change doesn't erase a theme.
function applyPatch(base: ChartSpec, patch: z.infer<typeof PatchSchema>): ChartSpec {
	const { style: patchStyle, ...topLevel } = patch;
	const merged: ChartSpec = { ...base, ...topLevel };
	if (patchStyle) {
		merged.style = { ...base.style, ...patchStyle };
	}
	return merged;
}

// Strip markdown code fences some models add despite instructions.
function stripFences(text: string): string {
	return text
		.trim()
		.replace(/^```(?:json)?\s*/i, "")
		.replace(/\s*```$/i, "")
		.trim();
}

export default defineEventHandler(async (event) => {
	// ── Gate: only authenticated users can spend AI calls ──
	const authUser = await requireUser(event);

	// ── Load plan + usage ──
	const me = await prisma.user.findUnique({
		where: { id: authUser.id },
		select: { plan: true, customizeCount: true, customizeResetAt: true },
	});
	if (!me) {
		throw createError({ statusCode: 404, statusMessage: "Account not found." });
	}

	const plan = PLANS[me.plan];

	// ── Reset the window if it's elapsed ──
	const now = Date.now();
	let count = me.customizeCount;
	if (now - me.customizeResetAt.getTime() > plan.windowMs) {
		count = 0;
		await prisma.user.update({
			where: { id: authUser.id },
			data: { customizeCount: 0, customizeResetAt: new Date() },
		});
	}

	// ── Enforce the free-tier limit (PRO is unlimited) ──
	if (count >= plan.customizeLimit) {
		throw createError({
			statusCode: 429,
			statusMessage: "You've hit your free limit. Upgrade for unlimited.",
		});
	}

	// ── Validate input ──
	const { currentSpec, instruction } = await readBody<{
		currentSpec?: unknown;
		instruction?: string;
	}>(event);

	if (!instruction?.trim()) {
		throw createError({ statusCode: 400, statusMessage: "instruction is required" });
	}

	const base = ChartSpecSchema.safeParse(currentSpec);
	if (!base.success) {
		throw createError({ statusCode: 400, statusMessage: "currentSpec is not a valid chart spec" });
	}

	const config = useRuntimeConfig();
	const client = new Anthropic({ apiKey: config.anthropicApiKey });

	const messages: Anthropic.MessageParam[] = [
		{
			role: "user",
			content: `Current spec (for context — do NOT return it):\n${JSON.stringify(base.data)}\n\nInstruction: ${instruction}\n\nReturn only the patch.`,
		},
	];

	for (let attempt = 0; attempt <= 2; attempt++) {
		const res = await client.messages.create({
			model: config.customizeModel,
			max_tokens: 1024,
			system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
			messages,
		});

		const block = res.content.find((b) => b.type === "text");
		const raw = stripFences(block && "text" in block ? block.text : "");

		// Parse defensively — a malformed response becomes a repair attempt, not a 500.
		let patch: z.infer<typeof PatchSchema> | null = null;
		let parseError: string | null = null;
		try {
			const result = PatchSchema.safeParse(JSON.parse(raw));
			if (result.success) {
				patch = result.data;
			} else {
				parseError = z.prettifyError(result.error);
			}
		} catch {
			parseError = "That was not valid JSON. Respond with ONLY the JSON patch object — no fences, no prose.";
		}

		if (patch) {
			const merged = applyPatch(base.data, patch);
			const final = ChartSpecSchema.safeParse(merged);
			if (final.success) {
				// ── Charge one customize — only on success, atomic increment ──
				await prisma.user.update({
					where: { id: authUser.id },
					data: { customizeCount: { increment: 1 } },
				});
				return { spec: final.data, raw: JSON.stringify(final.data, null, 2) };
			}
			parseError = `Applying that patch produced an invalid chart:\n${z.prettifyError(final.error)}`;
		}

		// Feed whatever went wrong back for repair.
		messages.push({ role: "assistant", content: raw });
		messages.push({ role: "user", content: `${parseError}\n\nReturn a corrected patch.` });
	}

	throw createError({ statusCode: 422, statusMessage: "Couldn't apply that change. Try rephrasing." });
});