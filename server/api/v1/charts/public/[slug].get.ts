// server/api/v1/charts/public/[slug].get.ts
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
	const slug = getRouterParam(event, "slug");

	const chart = await prisma.chart.findUnique({
		where: { slug },
		select: {
			slug: true, title: true, spec: true, isPublic: true, specVersion: true,
			user: { select: { plan: true } }, // ← the owner's plan
		},
	});

	// Only expose public charts; a private slug 404s to non-owners.
	if (!chart || !chart.isPublic) {
		throw createError({ statusCode: 404, statusMessage: "Chart not found." });
	}

	return {
		data: {
			slug: chart.slug,
			title: chart.title,
			spec: chart.spec,
			specVersion: chart.specVersion,
			ownerIsPro: chart.user.plan === "PRO",
		},
	};
});