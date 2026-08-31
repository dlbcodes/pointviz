// app/lib/schema.ts
import * as z from "zod";
import { THEME_NAMES, PALETTE_NAMES } from "~/lib/theme";

const HEX = z
	.string()
	.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "must be a hex color like #0d9488");

const AxisStyle = z.strictObject({
	visible: z.boolean().default(true),
	label: z.string().optional(),
	position: z.enum(["left", "right"]).optional(), // which side the axis sits on
});

const ValueLabels = z.union([
	z.boolean(),
	z.strictObject({
		show: z.boolean().default(true),
		position: z.enum(["inside", "top", "right", "left", "bottom"]).optional(),
		color: HEX.optional(),
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
	theme: z.enum(THEME_NAMES as [string, ...string[]]).optional(),     // whole house style
	palette: z.enum(PALETTE_NAMES as [string, ...string[]]).optional(), // named series-color set
	colors: z.array(HEX).optional(),                                    // explicit per-series hex
	gridColor: HEX.optional(),                                          // grid-line override
	title: TextStyle.optional(),      // title text size/color
	subtitle: TextStyle.optional(),   // subtitle text size/color
	backgroundColor: HEX.optional(),
	showValues: ValueLabels.optional(),                                // value labels on marks
	legend: z
		.strictObject({
			visible: z.boolean().default(true),
			position: z.enum(["top", "bottom", "left", "right"]).default("bottom"),
		})
		.optional(),
	xAxis: AxisStyle.optional(),
	yAxis: AxisStyle.optional(),
});

const SeriesSchema = z.strictObject({
	name: z.string(),
	values: z.array(z.number()),
});

export const ChartShapeSchema = z.strictObject({
	type: z.enum(["bar", "line", "area"]),
	orientation: z.enum(["vertical", "horizontal"]).default("vertical"),
	stack: z.boolean().default(false),
	title: z.string().optional(),
	subtitle: z.string().optional(),
	source: z.string().optional(),
	style: StyleSchema.optional(),
	categories: z.array(z.string()).min(1),
	series: z.array(SeriesSchema).min(1),
	goals: z.array(GoalSchema).optional(),
});

export const ChartSpecSchema = ChartShapeSchema.check((ctx) => {
	const { categories, series } = ctx.value;
	series.forEach((s, i) => {
		if (s.values.length !== categories.length) {
			ctx.issues.push({
				code: "custom",
				input: s.values,
				path: ["series", i, "values"],
				message: `series "${s.name}" has ${s.values.length} values but there are ${categories.length} categories`,
			});
		}
	});
});

export type ChartSpec = z.infer<typeof ChartSpecSchema>;