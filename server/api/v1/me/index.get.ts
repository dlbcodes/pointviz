// server/api/v1/me/index.get.ts
import { requireUser } from "~~/server/utils/auth";
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
	const authUser = await requireUser(event);

	const me = await prisma.user.findUnique({
		where: { id: authUser.id },
		select: {
			id: true,
			email: true,
			name: true,
			avatarUrl: true,
			plan: true,
			customizeCount: true,
			customizeResetAt: true,
			createdAt: true,
		},
	});

	if (!me) {
		// Auth user exists but no User row — trigger didn't fire, or race on first login.
		throw createError({ statusCode: 404, statusMessage: "Profile not found." });
	}

	return { data: me };
});