// app/lib/compile.ts
import type { ChartSpec } from "~/lib/schema";
import { THEMES, NAMED_PALETTES, type ThemeName, type ChartTheme } from "~/lib/theme";

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

function legendConfig(style: ChartSpec["style"], color: string) {
	const legend = style?.legend;
	if (legend?.visible === false) return { show: false };
	const pos = legend?.position ?? "bottom";
	const placement =
		pos === "top"
			? { top: 0, orient: "horizontal" as const }
			: pos === "left"
				? { left: 0, orient: "vertical" as const }
				: pos === "right"
					? { right: 0, orient: "vertical" as const }
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
		position: cfg.position ?? (horizontal ? "right" : "top"),
		color: cfg.color ?? defaultColor,
		fontSize: 10,
	};
}

function applyAxisStyle(
	axis: Record<string, unknown>,
	labelColor: string,
	gridColor: string,
	style?: { visible: boolean; label?: string },
) {
	const isValue = axis.type === "value";
	return {
		...axis,
		show: style?.visible !== false,
		axisLabel: { color: labelColor },
		axisLine: { lineStyle: { color: gridColor } },
		...(isValue
			? { splitLine: { lineStyle: { color: gridColor, type: "dashed" as const } } }
			: {}),
		...(style?.label
			? { name: style.label, nameGap: 28, nameTextStyle: { color: labelColor } }
			: {}),
	};
}

export function compileToECharts(spec: ChartSpec, tokenTheme: ChartTheme) {
	const { type, orientation, stack, categories, series, title, subtitle, style } = spec;
	const s = resolveStyle(spec, tokenTheme);
	const horizontal = orientation === "horizontal";

	const categoryAxis = { type: "category" as const, data: categories };
	const valueAxis = { type: "value" as const };

	const physicalX = applyAxisStyle(
		horizontal ? { ...valueAxis } : { ...categoryAxis },
		s.axisLabelColor, s.gridColor, style?.xAxis,
	);
	const physicalY = applyAxisStyle(
		horizontal ? { ...categoryAxis, inverse: true } : { ...valueAxis },
		s.axisLabelColor, s.gridColor, style?.yAxis,
	);

	const legend = legendConfig(style, s.subtitleColor);
	const legendPos = style?.legend?.position ?? "bottom";
	const legendVisible = legend.show !== false;

	// Normalize value-label config once, applied to every series below.
	const label = resolveLabel(style?.showValues, horizontal, s.axisLabelColor);

	return {
		backgroundColor: s.background,
		color: s.palette,
		title: title
			? {
				text: title,
				subtext: subtitle,
				left: 0,
				textStyle: {
					fontSize: TITLE_SIZES[style?.title?.size ?? "md"],
					color: style?.title?.color ?? s.titleColor,
				},
				subtextStyle: {
					fontSize: SUBTITLE_SIZES[style?.subtitle?.size ?? "md"],
					color: style?.subtitle?.color ?? s.subtitleColor,
				},
			}
			: undefined,
		tooltip: { trigger: "axis", axisPointer: { type: type === "bar" ? "shadow" : "line" } },
		legend,
		grid: {
			left: legendVisible && legendPos === "left" ? 96 : 8,
			right: legendVisible && legendPos === "right" ? 96 : 24,
			top: (title ? 64 : 24) + (legendVisible && legendPos === "top" ? 24 : 0),
			bottom: 24 + (legendVisible && legendPos === "bottom" ? 24 : 0),
			containLabel: true,
		},
		xAxis: physicalX,
		yAxis: physicalY,
		series: series.map((ser) => ({
			name: ser.name,
			type: type === "area" ? "line" : type,
			stack: stack ? "total" : undefined,
			areaStyle: type === "area" ? {} : undefined,
			label,
			data: ser.values,
		})),
	};
}