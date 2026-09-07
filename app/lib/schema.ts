// app/lib/schema.ts
import * as z from "zod";
import { THEME_NAMES, PALETTE_NAMES } from "~/lib/theme";

const HEX = z
	.string()
	.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "must be a hex color like #0d9488");

const AxisStyle = z.strictObject({
	visible: z.boolean().default(true),
	label: z.string().optional(),
	position: z.enum(["left", "right"]).optional(),
	min: z.number().optional(),
	max: z.number().optional(),
});

const ValueLabels = z.union([
	z.boolean(),
	z.strictObject({
		show: z.boolean().default(true),
		position: z.enum(["inside", "top", "right", "left", "bottom"]).optional(),
		color: HEX.optional(),
		total: z.boolean().optional(), // stacked charts: show the stack TOTAL instead of per-segment
	}),
]);

const TextStyle = z.strictObject({
	size: z.enum(["sm", "md", "lg", "xl"]).optional(),
	color: HEX.optional(),
});

const GoalSchema = z.strictObject({
	value: z.number(),
	label: z.string().optional(),
	color: HEX.optional(),
});

const StyleSchema = z.strictObject({
	theme: z.enum(THEME_NAMES as [string, ...string[]]).optional(),
	palette: z.enum(PALETTE_NAMES as [string, ...string[]]).optional(),
	colors: z.array(HEX).optional(),
	gridColor: HEX.optional(),
	title: TextStyle.optional(),
	subtitle: TextStyle.optional(),
	backgroundColor: HEX.optional(),
	showValues: ValueLabels.optional(),
	showSymbol: z.boolean().optional(),
	legend: z
		.strictObject({
			visible: z.boolean().default(true),
			position: z.enum(["top", "bottom", "left", "right"]).default("bottom"),
		})
		.optional(),
	xAxis: AxisStyle.optional(),
	yAxis: AxisStyle.optional(),
});

// ── Series shapes ──
// Value-based: one number per category (bar/line/area/pie/donut)
const ValueSeriesSchema = z.strictObject({
	name: z.string(),
	values: z.array(z.number()),
});

// Point-based: (x, y) pairs with optional labels (scatter)
const PointSchema = z.strictObject({
	x: z.number(),
	y: z.number(),
	label: z.string().optional(),
});
const PointSeriesSchema = z.strictObject({
	name: z.string(),
	points: z.array(PointSchema).min(1),
});

// ── Cartesian variant: category-vs-value charts ──
const CartesianShape = z.strictObject({
	type: z.enum(["bar", "line", "area", "pie", "donut"]),
	orientation: z.enum(["vertical", "horizontal"]).default("vertical"),
	stack: z.boolean().default(false),
	title: z.string().optional(),
	subtitle: z.string().optional(),
	source: z.string().optional(),
	style: StyleSchema.optional(),
	categories: z.array(z.string()).min(1),
	series: z.array(ValueSeriesSchema).min(1),
	goals: z.array(GoalSchema).optional(),
});

// ── Scatter variant: value-vs-value (no categories) ──
const ScatterShape = z.strictObject({
	type: z.literal("scatter"),
	title: z.string().optional(),
	subtitle: z.string().optional(),
	source: z.string().optional(),
	style: StyleSchema.optional(),
	xLabel: z.string().optional(), // what the x-axis represents (e.g. "Gini")
	yLabel: z.string().optional(), // what the y-axis represents (e.g. "Top 1% wealth share")
	showLabels: z.boolean().optional(),
	series: z.array(PointSeriesSchema).min(1),
});

// The shape (pre-validation) is the discriminated union.
export const ChartShapeSchema = z.discriminatedUnion("type", [CartesianShape, ScatterShape]);

// Full validation: cartesian charts must have aligned values; scatter has no such rule.
export const ChartSpecSchema = ChartShapeSchema.check((ctx) => {
	const v = ctx.value;
	if (v.type === "scatter") return; // scatter: no category alignment to check
	v.series.forEach((s, i) => {
		if (s.values.length !== v.categories.length) {
			ctx.issues.push({
				code: "custom",
				input: s.values,
				path: ["series", i, "values"],
				message: `series "${s.name}" has ${s.values.length} values but there are ${v.categories.length} categories`,
			});
		}
	});
});

export type ChartSpec = z.infer<typeof ChartSpecSchema>;