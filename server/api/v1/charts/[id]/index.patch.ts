// server/api/v1/charts/[id].patch.ts
import { requireUser } from "~~/server/utils/auth";
import { prisma } from "~~/server/utils/prisma";
import { updateChartSchema } from "~~/shared/types/chart";

export default defineEventHandler(async (event) => {
	const authUser = await requireUser(event);
	const id = getRouterParam(event, "id");

	const existing = await prisma.chart.findUnique({
		where: { id },
		select: { userId: true },
	});
	if (!existing || existing.userId !== authUser.id) {
		throw createError({ statusCode: 404, statusMessage: "Chart not found." });
	}

	// updateChartSchema embeds ChartSpecSchema, so if spec is present it's already
	// validated — and .refine() rejects an empty patch ("Nothing to update").
	const parsed = updateChartSchema.safeParse(await readBody(event));
	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			statusMessage: parsed.error.issues[0]?.message ?? "Invalid update.",
		});
	}

	// Build the update from only the fields actually provided.
	const { title, spec, isPublic } = parsed.data;
	const data: Record<string, unknown> = {};
	if (title !== undefined) data.title = title;
	if (isPublic !== undefined) data.isPublic = isPublic;
	if (spec !== undefined) data.spec = spec; // already a validated ChartSpec

	const chart = await prisma.chart.update({
		where: { id },
		data,
		select: { id: true, slug: true, title: true, isPublic: true, updatedAt: true },
	});

	return { data: chart };
});