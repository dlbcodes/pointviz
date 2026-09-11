// app/lib/compile-dumbbell.ts
import type { ChartSpec } from "~/lib/schema";
import type { CompileContext } from "./context";
import { TITLE_SIZES, SUBTITLE_SIZES } from "./chart-constants";
import { applyAxisStyle, legendConfig } from "./style";

type DumbbellSpec = Extract<ChartSpec, { type: "dumbbell" }>;

export function compileDumbbell(spec: DumbbellSpec, ctx: CompileContext) {
	const { s, preview, style, brandmark } = ctx;
	const { categories, series, title, subtitle } = spec;

	// Dumbbell charts strictly require exactly two series (e.g., "2019" and "2026")
	if (series.length !== 2) {
		throw new Error("Dumbbell charts require exactly two data series (e.g., Start and End).");
	}

	const startSeries = series[0];
	const endSeries = series[1];

	// Explicitly assign colors to ensure Start and End are distinct
	const startColor = style?.colors?.[0] ?? s.palette[0] ?? "#F2994A";
	const endColor = style?.colors?.[1] ?? s.palette[1] ?? "#50E3C2";
	const lineColor = style?.colors?.[2] ?? s.palette[2] ?? "#CBD5E1";

	const hasTitle = !preview && !!title;
	const titleBlockHeight = hasTitle ? 64 : 0;

	const legendPos = style?.legend?.position ?? "bottom";
	const showLegend = !preview && style?.legend?.visible !== false;
	const legendOnTop = showLegend && legendPos === "top";
	const legendTop = titleBlockHeight + (hasTitle ? 8 : 0);

	const legend = showLegend
		? { ...legendConfig(style, s, legendTop), data: [startSeries.name, endSeries.name] }
		: { show: false };

	// Y-Axis: Category (inverse: true puts the first item at the top, which is standard for dumbbells)
	const categoryAxis = applyAxisStyle(
		{ type: "category" as const, data: categories, inverse: true },
		s,
		style?.yAxis
	);

	// X-Axis: Value
	const valueAxis = applyAxisStyle(
		{ type: "value" as const },
		s,
		style?.xAxis
	);

	return {
		backgroundColor: s.background,
		color: [startColor, endColor],
		title: hasTitle
			? {
				text: title,
				subtext: subtitle,
				left: 0,
				top: 4,
				itemGap: 6,
				textStyle: {
					fontSize: TITLE_SIZES[style?.title?.size ?? "md"],
					color: style?.title?.color ?? s.titleColor,
					fontWeight: 600,
					fontFamily: s.titleFontFamily,
				},
				subtextStyle: {
					fontSize: SUBTITLE_SIZES[style?.subtitle?.size ?? "md"],
					color: style?.subtitle?.color ?? s.subtitleColor,
					fontFamily: s.titleFontFamily,
				},
			}
			: undefined,
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "shadow" },
			backgroundColor: "#333333",
			borderWidth: 0,
			padding: [8, 12],
			textStyle: { color: "#ffffff", fontSize: 14 },
			extraCssText: "border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.16);",
		},
		legend,
		grid: preview
			? { left: 8, right: 8, top: 8, bottom: 8, containLabel: true }
			: {
				left: showLegend && legendPos === "left" ? 120 : 12,
				right: showLegend && legendPos === "right" ? 120 : 16,
				top: titleBlockHeight + (legendOnTop ? 32 : 0) + 24,
				bottom: 32 + (showLegend && legendPos === "bottom" ? 28 : 0),
				containLabel: true,
			},
		graphic: brandmark,
		xAxis: valueAxis,
		yAxis: categoryAxis,
		series: [
			// 1. The Connecting Line (Custom Series)
			{
				type: "custom",
				name: "Range",
				renderItem: function (params: any, api: any) {
					const categoryIndex = api.value(0); // The Y-axis index
					const startVal = api.value(1);
					const endVal = api.value(2);

					const startPoint = api.coord([startVal, categoryIndex]);
					const endPoint = api.coord([endVal, categoryIndex]);

					return {
						type: "line",
						shape: {
							x1: startPoint[0],
							y1: startPoint[1],
							x2: endPoint[0],
							y2: endPoint[1],
						},
						style: {
							stroke: lineColor,
							lineWidth: 2,
							opacity: 0.6,
						},
					};
				},
				// Data format: [categoryIndex, startValue, endValue]
				data: categories.map((_, i) => [i, startSeries.values[i], endSeries.values[i]]),
				z: 1, // Draw behind the dots
			},
			// 2. Start Dots (e.g., 2019)
			{
				type: "scatter",
				name: startSeries.name,
				symbolSize: 12,
				itemStyle: { color: startColor },
				label: {
					show: style?.showValues ?? false,
					position: "left",
					formatter: (p: any) => String(Number(p.value[0].toFixed(1))),
					color: s.axisLabelColor,
					fontSize: 11,
					fontFamily: s.bodyFontFamily,
				},
				data: startSeries.values.map((val, i) => [val, i]), // [x, y]
				z: 2,
			},
			// 3. End Dots (e.g., 2026)
			{
				type: "scatter",
				name: endSeries.name,
				symbolSize: 12,
				itemStyle: { color: endColor },
				label: {
					show: style?.showValues ?? false,
					position: "right",
					formatter: (p: any) => String(Number(p.value[0].toFixed(1))),
					color: s.axisLabelColor,
					fontSize: 11,
					fontFamily: s.bodyFontFamily,
				},
				data: endSeries.values.map((val, i) => [val, i]), // [x, y]
				z: 2,
			},
		],
	};
}