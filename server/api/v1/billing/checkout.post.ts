import { requireUser } from "~~/server/utils/auth";
import { prisma } from "~~/server/utils/prisma";
import { useStripe } from "~~/server/utils/stripe";

export default defineEventHandler(async (event) => {
	const authUser = await requireUser(event);
	const stripe = useStripe();
	const config = useRuntimeConfig();
	const origin = getRequestURL(event).origin;

	if (!config.stripePricePro) {
		throw createError({ statusCode: 500, statusMessage: "Billing is not configured." });
	}

	const me = await prisma.user.findUnique({
		where: { id: authUser.id },
		select: { id: true, email: true, plan: true, stripeCustomerId: true },
	});
	if (!me) throw createError({ statusCode: 404, statusMessage: "Account not found." });
	if (me.plan === "PRO") throw createError({ statusCode: 400, statusMessage: "Already on Pro." });

	// Reuse or create the Stripe customer
	let customerId = me.stripeCustomerId;
	if (!customerId) {
		const customer = await stripe.customers.create({
			email: me.email,
			metadata: { userId: me.id },
		});
		customerId = customer.id;
		await prisma.user.update({
			where: { id: me.id },
			data: { stripeCustomerId: customerId },
		});
	}

	const session = await stripe.checkout.sessions.create({
		mode: "subscription",
		customer: customerId,
		line_items: [{ price: config.stripePricePro, quantity: 1 }],
		success_url: `${origin}/account?upgraded=1`,
		cancel_url: `${origin}/charts`,
		client_reference_id: me.id,
		metadata: { userId: me.id },
	});

	return { url: session.url };
});