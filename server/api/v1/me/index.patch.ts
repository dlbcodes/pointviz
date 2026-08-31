// server/api/v1/me/index.patch.ts
import { requireUser } from "~~/server/utils/auth";
import { prisma } from "~~/server/utils/prisma";
import { updateMeSchema } from "~~/shared/types/user";

export default defineEventHandler(async (event) => {
	const authUser = await requireUser(event);

	const body = await readBody(event);
	const parsed = updateMeSchema.safeParse(body);
	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			statusMessage: parsed.error.issues[0]?.message ?? "Invalid update.",
		});
	}

	const me = await prisma.user.update({
		where: { id: authUser.id },
		data: parsed.data, // only name/avatarUrl can be here — schema guarantees it
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

	return { data: me };
});