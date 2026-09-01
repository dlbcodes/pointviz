// shared/types/chart.ts
import { z } from "zod";
import { ChartSpecSchema, type ChartSpec } from "~/lib/schema";

// ── Input schemas (validated on the server, reused on the client) ──

export const createChartSchema = z.object({
	title: z.string().trim().max(200).optional(),
	spec: ChartSpecSchema, // validate the real spec, not z.unknown()
	isPublic: z.boolean().optional(),
});

export const updateChartSchema = z
	.object({
		title: z.string().trim().max(200).nullable().optional(),
		spec: ChartSpecSchema.optional(),
		isPublic: z.boolean().optional(),
	})
	.refine((d) => Object.keys(d).length > 0, { message: "Nothing to update." });

export type CreateChartInput = z.infer<typeof createChartSchema>;
export type UpdateChartInput = z.infer<typeof updateChartSchema>;

// ── Response shapes ──

// List/summary view — no spec, for the "My charts" list.
export interface ChartSummary {
	id: string;
	slug: string;
	title: string | null;
	isPublic: boolean;
	updatedAt: string;
}

// Detail view — includes the spec, for opening a chart.
export interface ChartDetail extends ChartSummary {
	spec: ChartSpec;
	specVersion: number;
	createdAt: string;
}