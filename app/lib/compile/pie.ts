import type { ChartSpec } from "~/lib/schema";
import type { CompileContext } from "./context";
import { TITLE_SIZES, SUBTITLE_SIZES } from "./chart-constants";

type PieSpec = Extract<ChartSpec, { type: "pie" | "donut" }>;

export function compilePie(spec: PieSpec, ctx: CompileContext) {
	const { s, preview, style, brandmark } = ctx;
	const { type, categories, series, title, subtitle } = spec;

	const first = series[0];
	const pieData = categories.map((cat, i) => ({ name: cat, value: first?.values[i] ?? 0 }));
	const hasTitlePie = !preview && !!title;

	return {
		backgroundColor: s.background,
		color: s.palette,
		title: hasTitlePie
			? {
				text: title,
				subtext: subtitle,
				left: "center",
				top: 8,
				textStyle: { fontSize: TITLE_SIZES[style?.title?.size ?? "md"], color: style?.title?.color ?? s.titleColor, fontWeight: 600, fontFamily: s.titleFontFamily, },
				subtextStyle: { fontSize: SUBTITLE_SIZES[style?.subtitle?.size ?? "md"], color: style?.subtitle?.color ?? s.subtitleColor, fontFamily: s.titleFontFamily, },
			}
			: undefined,
		tooltip: {
			trigger: "item",
			backgroundColor: "#333333",
			borderWidth: 0,
			padding: [8, 12],
			textStyle: { color: "#ffffff", fontSize: 13, fontFamily: s.bodyFontFamily },
			extraCssText: "border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.16);",
			formatter: "{b}: {c} ({d}%)",
		},
		legend: !preview && style?.legend?.visible !== false
			? { bottom: 0, textStyle: { color: s.subtitleColor, fontFamily: s.bodyFontFamily } }
			: { show: false },
		series: [
			{
				type: "pie",
				radius: type === "donut" ? ["45%", "70%"] : "70%",
				center: ["50%", hasTitlePie ? "54%" : "50%"],
				data: pieData,
				label: { show: !preview, color: s.axisLabelColor, formatter: "{b}", fontFamily: s.bodyFontFamily },
				labelLine: { show: !preview },
				emphasis: { disabled: true },
			},
		],
		graphic: brandmark,
	};
}