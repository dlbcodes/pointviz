// server/api/v1/charts/index.post.ts
import { requireUser } from "~~/server/utils/auth";
import { prisma } from "~~/server/utils/prisma";
import { createChartSchema } from "~~/shared/types/chart";

// URL-safe short slug for share links.
function makeSlug(): string {
	return Math.random().toString(36).slice(2, 10);
}

export default defineEventHandler(async (event) => {
	const authUser = await requireUser(event);

	// createChartSchema embeds ChartSpecSchema, so a successful parse means
	// parsed.data.spec is already a validated ChartSpec — no second check needed.
	const parsed = createChartSchema.safeParse(await readBody(event));
	if (!parsed.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid chart payload." });
	}

	const chart = await prisma.chart.create({
		data: {
			userId: authUser.id,
			title: parsed.data.title ?? parsed.data.spec.title ?? null,
			spec: parsed.data.spec,
			isPublic: parsed.data.isPublic ?? false,
			slug: makeSlug(),
			specVersion: 1,
		},
		select: { id: true, slug: true, title: true, isPublic: true, createdAt: true },
	});

	return { data: chart };
});