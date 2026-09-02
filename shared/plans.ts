// shared/plans.ts
export const PLANS = {
	FREE: {
		id: "FREE",
		customizeLimit: 40,
		windowMs: 1000 * 60 * 60 * 24 * 30, // 30 days
	},
	PRO: {
		id: "PRO",
		customizeLimit: Infinity,
		windowMs: 1000 * 60 * 60 * 24 * 30,
	},
} as const;

export type PlanId = keyof typeof PLANS;