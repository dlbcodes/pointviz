import type { ChartSpec } from "~/lib/schema";
import type { CompileContext } from "./context";
import { TITLE_SIZES, SUBTITLE_SIZES } from "./chart-constants";

// narrow to the scatter variant
type ScatterSpec = Extract<ChartSpec, { type: "scatter" }>;

export function compileScatter(spec: ScatterSpec, ctx: CompileContext) {
	const { s, preview, style, brandmark } = ctx;
	const hasTitleScatter = !preview && !!spec.title;
	const showLegend = !preview && style?.legend?.visible !== false && spec.series.length > 1;

	return {
		backgroundColor: s.background,
		color: s.palette,
		title: hasTitleScatter
			? {
				text: spec.title,
				subtext: spec.subtitle,
				left: 0,
				top: 4,
				itemGap: 6,
				textStyle: { fontSize: TITLE_SIZES[style?.title?.size ?? "md"], color: style?.title?.color ?? s.titleColor, fontWeight: 600, fontFamily: s.titleFontFamily, },
				subtextStyle: { fontSize: SUBTITLE_SIZES[style?.subtitle?.size ?? "md"], color: style?.subtitle?.color ?? s.subtitleColor, fontFamily: s.titleFontFamily, },
			}
			: undefined,
		tooltip: {
			trigger: "item",
			backgroundColor: "#333333",
			borderWidth: 0,
			padding: [8, 12],
			textStyle: { color: "#ffffff", fontSize: 13 },
			extraCssText: "border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.16);",
			// data is [x, y, label]; show label + both axis values
			formatter: (p: { data: [number, number, string?] }) => {
				const [x, y, label] = p.data;
				const xl = spec.xLabel ?? "x";
				const yl = spec.yLabel ?? "y";
				return `${label ? `<b>${label}</b><br/>` : ""}${xl}: ${x}<br/>${yl}: ${y}`;
			},
		},
		legend: showLegend ? { bottom: 0, textStyle: { color: s.subtitleColor, fontFamily: s.bodyFontFamily } } : { show: false },
		grid: preview
			? { left: 8, right: 8, top: 8, bottom: 8, containLabel: true }
			: {
				left: 12,
				right: 16,
				top: (hasTitleScatter ? 64 : 24),
				bottom: 32 + (showLegend ? 28 : 0),
				containLabel: true,
			},
		xAxis: {
			type: "value",
			name: preview ? undefined : spec.xLabel,
			nameLocation: "middle",
			nameGap: 28,
			...(style?.xAxis?.min !== undefined ? { min: style.xAxis.min } : {}),
			...(style?.xAxis?.max !== undefined ? { max: style.xAxis.max } : {}),
			axisTick: { show: false },
			axisLine: { show: false },
			axisLabel: { color: s.axisLabelColor, fontWeight: 500, fontSize: 11 },
			nameTextStyle: { color: s.axisLabelColor, fontWeight: 500 },
			splitLine: { lineStyle: { color: s.gridColor, type: "dashed" as const, opacity: 0.6 } },
		},
		yAxis: {
			type: "value",
			name: preview ? undefined : spec.yLabel,
			nameLocation: "middle",
			nameGap: 40,
			...(style?.yAxis?.min !== undefined ? { min: style.yAxis.min } : {}),
			...(style?.yAxis?.max !== undefined ? { max: style.yAxis.max } : {}),
			axisTick: { show: false },
			axisLine: { show: false },
			axisLabel: { color: s.axisLabelColor, fontWeight: 500, fontSize: 11, fontFamily: s.bodyFontFamily },
			nameTextStyle: { color: s.axisLabelColor, fontWeight: 500, fontFamily: s.bodyFontFamily },
			splitLine: { lineStyle: { color: s.gridColor, type: "dashed" as const, opacity: 0.6 } },
		},
		series: spec.series.map((ser) => ({
			name: ser.name,
			type: "scatter" as const,
			symbolSize: 10,
			data: ser.points.map((pt) => [pt.x, pt.y, pt.label]),
			emphasis: { disabled: true },
			label: spec.showLabels && !preview
				? {
					show: true,
					position: "right",
					formatter: (p: { data: [number, number, string?] }) => p.data[2] ?? "",
					fontSize: 10,
					color: s.axisLabelColor,
					fontFamily: s.bodyFontFamily
				}
				: { show: false },
			labelLayout: { hideOverlap: true }, // drop labels that would collide — keeps dense scatters readable
		})),
		graphic: brandmark,
	};
}