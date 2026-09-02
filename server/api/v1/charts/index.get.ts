// server/api/v1/charts/index.get.ts
import { requireUser } from "~~/server/utils/auth";
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
	const authUser = await requireUser(event);

	const charts = await prisma.chart.findMany({
		where: { userId: authUser.id },
		select: { id: true, slug: true, title: true, spec: true, isPublic: true, updatedAt: true },
		orderBy: { updatedAt: "desc" },
		take: 100,
	});

	return { data: charts };
});