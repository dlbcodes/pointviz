// app/lib/pricing.ts
import { PLANS } from "~~/shared/plans";

// app/lib/pricing.ts — add cta to the interface and both tiers
export interface PricingTier {
	id: "FREE" | "PRO";
	name: string;
	price: string;
	period: string;
	tagline: string;
	cta: string;          // ← add
	features: string[];
	highlight: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
	{
		id: "FREE",
		name: "Free",
		price: "$0",
		period: "forever",
		tagline: "Everything you need to make.",
		cta: "Get started",           // ← add
		features: [
			`${PLANS.FREE.customizeLimit} AI customizations / month`,
			"Unlimited manual charts",
			"Save & organize your charts",
			"Public share links & embeds",
			"PNG export",
		],
		highlight: false,
	},
	{
		id: "PRO",
		name: "Pro",
		price: "$14",
		period: "/ month",
		tagline: "For when you're charting a lot.",
		cta: "Upgrade to Pro",        // ← add
		features: [
			"Unlimited AI customizations",
			"No PointViz badge on exports & embeds",
			"Everything in Free",
		],
		highlight: true,
	},
];