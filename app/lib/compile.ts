// app/lib/compile.ts
import type { ChartSpec } from "~/lib/schema";
import { THEMES, NAMED_PALETTES, type ThemeName, type ChartTheme } from "~/lib/theme";
// app/lib/compile.ts — near the top, module scope
const BRANDMARK_DATA_URI =
	"data:image/svg+xml,%3Csvg width='29px' height='32px' viewBox='0 0 29 32' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg id='Logo-Black' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='Group' transform='translate(0.000000, 1.000000)' fill='%23000000' fill-rule='nonzero'%3E%3Cpath d='M27.84,6.93954222 L15.5707692,0.274179322 L15.5707692,0.274179322 C14.9044015,-0.0913931073 14.0955985,-0.0913931073 13.4292308,0.274179322 L1.16,6.94231081 C0.446359129,7.32999513 0.0018465146,8.07264079 0,8.88031871 L0,22.1196813 C0.0018465146,22.9273592 0.446359129,23.6700049 1.16,24.0576892 L13.4292308,30.7258207 C14.0955985,31.0913931 14.9044015,31.0913931 15.5707692,30.7258207 L27.84,24.0576892 C28.5536409,23.6700049 28.9981535,22.9273592 29,22.1196813 L29,8.881703 C28.9996793,8.0725362 28.5549535,7.32794226 27.84,6.93954222 Z M14.5,2.21218723 L14.5,2.21218723 L25.70125,8.30306921 L14.5,14.3939512 L3.29875,8.30306921 L14.5,2.21218723 Z M2.23076923,10.2410771 L13.3846154,16.3015047 L13.3846154,28.1773403 L2.23076923,22.1210656 L2.23076923,10.2410771 Z' id='Shape'%3E%3C/path%3E%3Cpolygon id='Path' points='16 28 16 16.0875203 27 10 27 21.9166474'%3E%3C/polygon%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

// Semantic type scale the compiler owns — the agent picks sm/md/lg/xl, we map to px.
const TITLE_SIZES = { sm: 16, md: 18, lg: 22, xl: 26 } as const;
const SUBTITLE_SIZES = { sm: 10, md: 12, lg: 14, xl: 16 } as const;

function resolveStyle(spec: ChartSpec, tokenTheme: ChartTheme) {
	const name = (spec.style?.theme ?? "default") as ThemeName;
	const base = THEMES[name];
	const st = spec.style;

	// Precedence: explicit hex → named palette → theme palette → tokens (default only)
	let palette: string[];
	if (st?.colors?.length) {
		palette = st.colors;
	} else if (st?.palette) {
		palette = [...NAMED_PALETTES[st.palette]];
	} else if (name === "default") {
		palette = tokenTheme.defaultPalette;
	} else {
		palette = base.palette;
	}

	return {
		background: st?.backgroundColor ?? base.background,   // override wins over theme
		titleColor: base.title,
		subtitleColor: base.subtitle,
		axisLabelColor: base.axisLabel,
		gridColor: st?.gridColor ?? base.grid,
		palette,
	};
}

function legendConfig(style: ChartSpec["style"], color: string, topOffset: number) {
	const legend = style?.legend;
	if (legend?.visible === false) return { show: false };
	const pos = legend?.position ?? "bottom";
	const placement =
		pos === "top"
			? { top: topOffset, orient: "horizontal" as const }
			: pos === "left"
				? { left: 0, top: "middle" as const, orient: "vertical" as const }
				: pos === "right"
					? { right: 0, top: "middle" as const, orient: "vertical" as const }
					: { bottom: 0, orient: "horizontal" as const };
	return { show: true, textStyle: { color }, ...placement };
}

// Normalize showValues (boolean | object | undefined) into a single config or null.
function resolveLabel(
	showValues: ChartSpec["style"] extends infer S ? (S extends { showValues?: infer V } ? V : never) : never,
	horizontal: boolean,
	defaultColor: string,
) {
	const vl = showValues;
	const cfg = vl === true ? { show: true } : vl && typeof vl === "object" ? vl : null;
	if (!cfg) return undefined;
	return {
		show: cfg.show !== false,
		formatter: function (cfg) {
			return Number(cfg.value).toFixed(2); // Keeps 2 decimal places
		},
		position: cfg.position ?? (horizontal ? "right" : "top"),
		color: cfg.color ?? defaultColor,
		fontWeight: 500,
		fontSize: 11,
	};
}

function applyAxisStyle(
	axis: Record<string, unknown>,
	labelColor: string,
	gridColor: string,
	style?: { visible: boolean; label?: string; position?: "left" | "right"; min?: number; max?: number },
) {
	const isValue = axis.type === "value";
	return {
		...axis,
		...(isValue && style?.min !== undefined ? { min: style.min } : {}),
		...(isValue && style?.max !== undefined ? { max: style.max } : {}),
		show: style?.visible !== false,
		axisTick: { show: false }, // no tick marks — cleaner
		axisLine: { show: false, lineStyle: { color: gridColor } }, // no axis frame on either axis
		axisLabel: {
			color: labelColor,
			fontWeight: 500, // medium — the "typeset" feel
			fontSize: 11,
		},
		// left/right is meaningful for the value/category axis on the y side;
		// on the x-axis ECharts expects top/bottom, so this is a harmless no-op there.
		...(style?.position ? { position: style.position } : {}),
		...(isValue
			? {
				splitLine: {
					lineStyle: { color: gridColor, type: "dashed" as const, opacity: 0.6 },
				},
			}
			: { splitLine: { show: false } }),
		...(style?.label
			? {
				name: style.label,
				nameGap: 28,
				nameTextStyle: { color: labelColor, fontWeight: 500 },
			}
			: {}),
	};
}

export function compileToECharts(spec: ChartSpec, tokenTheme: ChartTheme, opts: { brandmark?: boolean; preview?: boolean } = {}) {
	const { type, orientation, stack, categories, series, title, subtitle, style, goals } = spec;
	const s = resolveStyle(spec, tokenTheme);
	const horizontal = orientation === "horizontal";

	const categoryAxis = { type: "category" as const, data: categories };
	const valueAxis = { type: "value" as const };

	const preview = opts.preview ?? false;
	const showBrandmark = !preview && (opts.brandmark ?? true);

	const physicalX = applyAxisStyle(
		horizontal ? { ...valueAxis } : { ...categoryAxis },
		s.axisLabelColor, s.gridColor, style?.xAxis,
	);
	const physicalY = applyAxisStyle(
		horizontal ? { ...categoryAxis, inverse: true } : { ...valueAxis },
		s.axisLabelColor, s.gridColor, style?.yAxis,
	);

	// --- Vertical stack math for the top region ---
	const hasTitle = !preview && !!spec.title; // title/subtitle suppressed in preview
	const titleBlockHeight = hasTitle ? 64 : 0;

	// Legend follows the spec, NOT preview — it stays visible in previews.
	const legendPos = style?.legend?.position ?? "bottom";
	const showLegend = !preview && style?.legend?.visible !== false;
	const legendOnTop = showLegend && legendPos === "top";
	const legendTop = titleBlockHeight + (hasTitle ? 8 : 0);

	const legend = showLegend
		? legendConfig(style, s.subtitleColor, legendTop)
		: { show: false };

	const label = resolveLabel(style?.showValues, horizontal, s.axisLabelColor);

	const markLine =
		goals?.length
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
				textStyle: {
					fontSize: TITLE_SIZES[style?.title?.size ?? "md"],
					color: style?.title?.color ?? s.titleColor,
					fontWeight: 600,
				},
				subtextStyle: {
					fontSize: SUBTITLE_SIZES[style?.subtitle?.size ?? "md"],
					color: style?.subtitle?.color ?? s.subtitleColor,
				},
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
		graphic: showBrandmark
			? [
				{
					type: "group",
					right: 20,      // was 12 — more room on the right
					bottom: 0,     // was 10 — more room below, so shadow isn't clipped
					z: 100,
					silent: true,
					children: [
						// rounded background box with subtle shadow
						{
							type: "rect",
							shape: { width: 162, height: 28, r: 8 },
							style: {
								fill: "#ffffff",
								stroke: "#e0e0e0",   // border color
								lineWidth: 1,         // border width
							},
						},
						// logo image (needs a raster/data-URI of your brandmark)
						{
							type: "image",
							left: 8,
							top: 6,
							style: { image: BRANDMARK_DATA_URI, width: 16, height: 16 },
						},
						// text
						{
							type: "text",
							left: 30,
							top: 8,
							style: {
								text: "Made with PointViz.co",
								fontSize: 12,
								fontWeight: 600,
								fill: "#141414",
							},
						},
					],
				},
			]
			: undefined,
		xAxis: physicalX,
		yAxis: physicalY,
		series: series.map((ser, i) => ({
			name: ser.name,
			type: type === "area" ? "line" : type,
			stack: stack ? "total" : undefined,
			areaStyle: type === "area" ? { opacity: 0.15 } : undefined,
			barCategoryGap: "40%",
			emphasis: { disabled: true },
			itemStyle:
				type === "bar"
					? { borderRadius: horizontal ? [0, 0, 0, 0] : [4, 4, 0, 0] }
					: undefined,
			smooth: type !== "bar" ? 0.35 : undefined,
			lineStyle: type !== "bar" ? { width: 2.5 } : undefined,
			label,
			...(i === 0 && markLine ? { markLine } : {}),
			data: ser.values,
		})),
	};

}