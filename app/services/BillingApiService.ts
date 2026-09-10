// app/services/BillingApiService.ts
import { BaseApiService } from "./BaseApiService";
import { ApiError } from "./ApiError";

class BillingApiService extends BaseApiService {
	constructor() {
		super("/api/v1/billing");
	}

	/** Start Pro checkout — returns the Stripe Checkout URL to redirect to. */
	async createCheckout(): Promise<string> {
		try {
			const { url } = await $fetch<{ url: string }>(`${this.baseUrl}/checkout`, {
				method: "POST",
			});
			return url;
		} catch (e) {
			throw this._handleError(e, "Couldn't start checkout.", ApiError);
		}
	}

	/** Open the Stripe billing portal — returns the portal URL to redirect to. */
	async createPortalSession(): Promise<string> {
		try {
			const { url } = await $fetch<{ url: string }>(`${this.baseUrl}/portal`, {
				method: "POST",
			});
			return url;
		} catch (e) {
			throw this._handleError(e, "Couldn't open billing.", ApiError);
		}
	}
}

export const billingApiService = new BillingApiService();