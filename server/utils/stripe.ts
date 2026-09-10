import Stripe from "stripe";

let _stripe: Stripe | null = null;
export function useStripe(): Stripe {
	if (!_stripe) {
		const config = useRuntimeConfig();
		if (!config.stripeSecretKey) throw new Error("stripeSecretKey not set");
		_stripe = new Stripe(config.stripeSecretKey);
	}
	return _stripe;
}