import { requireUser } from "~~/server/utils/auth";
import { prisma } from "~~/server/utils/prisma";
import { useStripe } from "~~/server/utils/stripe";

export default defineEventHandler(async (event) => {
	const authUser = await requireUser(event);
	const stripe = useStripe();
	const origin = getRequestURL(event).origin;

	const me = await prisma.user.findUnique({ where: { id: authUser.id }, select: { stripeCustomerId: true } });
	if (!me?.stripeCustomerId) throw createError({ statusCode: 400, statusMessage: "No billing account." });

	const session = await stripe.billingPortal.sessions.create({
		customer: me.stripeCustomerId,
		return_url: `${origin}/account`,
	});
	return { url: session.url };
});