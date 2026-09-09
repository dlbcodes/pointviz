import type { ChartSpec } from "~/lib/schema";
import type { CompileContext } from "./context";
import { TITLE_SIZES, SUBTITLE_SIZES } from "./chart-constants";
import { applyAxisStyle, legendConfig, resolveLabel } from "./style";

type CartesianSpec = Extract<ChartSpec, { type: "bar" | "line" | "area" }>;

export function compileCartesian(spec: CartesianSpec, ctx: CompileContext) {
	const { s, preview, style, brandmark } = ctx;
	const { type, orientation, stack, categories, series, title, subtitle, goals } = spec;
	const horizontal = orientation === "horizontal";

	const categoryAxis = { type: "category" as const, data: categories };
	const valueAxis = { type: "value" as const };

	const physicalX = applyAxisStyle(
		horizontal ? { ...valueAxis } : { ...categoryAxis },
		s, style?.xAxis,
	);
	const physicalY = applyAxisStyle(
		horizontal ? { ...categoryAxis, inverse: true } : { ...valueAxis },
		s, style?.yAxis,
	);

	const hasTitle = !preview && !!title;
	const titleBlockHeight = hasTitle ? 64 : 0;

	const legendPos = style?.legend?.position ?? "bottom";
	const showLegend = !preview && style?.legend?.visible !== false;
	const legendOnTop = showLegend && legendPos === "top";
	const legendTop = titleBlockHeight + (hasTitle ? 8 : 0);

	const legend = showLegend
		? { ...legendConfig(style, s, legendTop), data: series.map((ser) => ser.name) }
		: { show: false };
	const label = resolveLabel(style?.showValues, horizontal, s);

	const markLine = goals?.length
		? {
			silent: true,
			symbol: "none" as const,
			data: goals.map((g) => ({
				...(horizontal ? { xAxis: g.value } : { yAxis: g.value }),
				lineStyle: { color: g.color ?? s.subtitleColor, type: "dashed" as const, width: 1.5 },
				label: {
					show: !!g.label,
					formatter: g.label ?? "",
					position: "end" as const,
					color: g.color ?? s.subtitleColor,
					fontSize: 11,
					fontWeight: 500,
				},
			})),
		}
		: undefined;

	const showValues = style?.showValues;
	const wantsTotal =
		typeof showValues === "object" && showValues !== null && "total" in showValues && showValues.total === true;
	const showStackTotal = wantsTotal && stack && type === "bar";

	const totals = categories.map((_, i) =>
		series.reduce((sum, ser) => sum + (ser.values[i] ?? 0), 0),
	);

	const totalSeries = showStackTotal
		? {
			name: "__total__",
			type: "bar" as const,
			stack: "total", // same stack group as the real bars
			data: totals.map(() => 0), // zero height — adds nothing to the bar
			itemStyle: { color: "transparent" },
			emphasis: { disabled: true },
			tooltip: { show: false },
			silent: true,
			label: {
				show: true,
				position: horizontal ? "right" : "top",
				formatter: (p: { dataIndex: number }) => String(Number(totals[p.dataIndex].toFixed(2))),
				color: s.axisLabelColor,
				fontWeight: 500,
				fontSize: 11,
				fontFamily: s.bodyFontFamily
			},
		}
		: undefined;

	return {
		backgroundColor: s.background,
		color: s.palette,
		title: hasTitle
			? {
				text: title,
				subtext: subtitle,
				left: 0,
				top: 4,
				itemGap: 6,
				textStyle: { fontSize: TITLE_SIZES[style?.title?.size ?? "md"], color: style?.title?.color ?? s.titleColor, fontWeight: 600, fontFamily: s.titleFontFamily, },
				subtextStyle: { fontSize: SUBTITLE_SIZES[style?.subtitle?.size ?? "md"], color: style?.subtitle?.color ?? s.subtitleColor, fontFamily: s.titleFontFamily, },
			}
			: undefined,
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "line", lineStyle: { color: s.gridColor, type: "dashed" } },
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
		xAxis: physicalX,
		yAxis: physicalY,
		series: [
			...series.map((ser, i) => ({
				name: ser.name,
				type: type === "area" ? "line" : type,
				stack: stack ? "total" : undefined,
				areaStyle: type === "area" ? { opacity: 0.15 } : undefined,
				barCategoryGap: "40%",
				emphasis: { disabled: true },
				itemStyle: type === "bar" ? { borderRadius: horizontal ? [0, 0, 0, 0] : [4, 4, 0, 0] } : undefined,
				smooth: type !== "bar" ? 0.35 : undefined,
				lineStyle: type !== "bar" ? { width: 2.5 } : undefined,
				showSymbol: type !== "bar" ? (style?.showSymbol ?? true) : undefined,
				label,
				...(i === 0 && markLine ? { markLine } : {}),
				data: ser.values,
			})),
			...(totalSeries ? [totalSeries] : []),  // ← append the phantom total series
		],
	};
}