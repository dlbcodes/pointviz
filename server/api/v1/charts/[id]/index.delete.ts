// server/api/v1/charts/[id].delete.ts
import { requireUser } from "~~/server/utils/auth";
import { prisma } from "~~/server/utils/prisma";

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

	await prisma.chart.delete({ where: { id } });
	return { data: { ok: true } };
});