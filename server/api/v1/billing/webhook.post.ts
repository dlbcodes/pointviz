import type Stripe from "stripe";
import { prisma } from "~~/server/utils/prisma";
import { useStripe } from "~~/server/utils/stripe";

export default defineEventHandler(async (event) => {
	const stripe = useStripe();
	const secret = process.env.STRIPE_WEBHOOK_SECRET!;

	// Nitro parses JSON by default — we need the RAW body for signature verification.
	const rawBody = await readRawBody(event, false); // false = get Buffer/string, unparsed
	const sig = getHeader(event, "stripe-signature");
	if (!rawBody || !sig) {
		throw createError({ statusCode: 400, statusMessage: "Missing body or signature." });
	}

	let stripeEvent: Stripe.Event;
	try {
		stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, secret);
	} catch {
		// signature verification failed — reject (could be a forgery)
		throw createError({ statusCode: 400, statusMessage: "Invalid signature." });
	}

	// Helper: set a user's plan from a subscription's state
	async function syncFromSubscription(sub: Stripe.Subscription) {
		const customerId = sub.customer as string;
		const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId }, select: { id: true } });
		if (!user) return;

		const isActive = sub.status === "active" || sub.status === "trialing";

		// current_period_end moved to the subscription item in newer API versions
		const periodEnd = sub.items?.data?.[0]?.current_period_end;

		await prisma.user.update({
			where: { id: user.id },
			data: {
				plan: isActive ? "PRO" : "FREE",
				stripeSubscriptionId: sub.id,
				planExpiresAt: periodEnd ? new Date(periodEnd * 1000) : null,
			},
		});
	}

	switch (stripeEvent.type) {
		case "checkout.session.completed": {
			const session = stripeEvent.data.object as Stripe.Checkout.Session;
			if (session.subscription) {
				const sub = await stripe.subscriptions.retrieve(session.subscription as string);
				await syncFromSubscription(sub);
			}
			break;
		}
		case "customer.subscription.updated":
		case "customer.subscription.created": {
			await syncFromSubscription(stripeEvent.data.object as Stripe.Subscription);
			break;
		}
		case "customer.subscription.deleted": {
			// cancelled / ended → downgrade to FREE
			const sub = stripeEvent.data.object as Stripe.Subscription;
			const user = await prisma.user.findUnique({ where: { stripeCustomerId: sub.customer as string }, select: { id: true } });
			if (user) {
				await prisma.user.update({
					where: { id: user.id },
					data: { plan: "FREE", stripeSubscriptionId: null, planExpiresAt: null },
				});
			}
			break;
		}
	}

	return { received: true };
});