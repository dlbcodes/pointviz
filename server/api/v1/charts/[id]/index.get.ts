// server/api/v1/charts/[id].get.ts
import { requireUser } from "~~/server/utils/auth";
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
	const authUser = await requireUser(event);
	const id = getRouterParam(event, "id");

	const chart = await prisma.chart.findUnique({
		where: { id },
		select: { id: true, slug: true, title: true, spec: true, isPublic: true, userId: true, specVersion: true },
	});

	if (!chart || chart.userId !== authUser.id) {
		throw createError({ statusCode: 404, statusMessage: "Chart not found." });
	}

	// Strip userId before returning — internal only.
	const { userId, ...rest } = chart;
	return { data: rest };
});