// app/lib/pricing.ts
import { PLANS } from "~~/shared/plans";

export interface PricingTier {
	id: "FREE" | "PRO";
	name: string;
	price: string;
	period: string;
	tagline: string;
	features: string[];
	highlight: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
	{
		id: "FREE",
		name: "Free",
		price: "$0",
		period: "forever",
		tagline: "Everything you need to make and share charts.",
		features: [
			`${PLANS.FREE.customizeLimit} AI customizations / month`, // reads the enforced limit
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
		price: "$12",
		period: "/ month",
		tagline: "For when you're charting a lot.",
		features: [
			"Unlimited AI customizations",
			"No PointViz badge on exports & embeds",
			"Everything in Free",
		],
		highlight: true,
	},
];

// Convenience accessors for components that want one tier.
export const FREE_TIER = PRICING_TIERS[0];
export const PRO_TIER = PRICING_TIERS[1];