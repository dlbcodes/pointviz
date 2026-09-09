import type { ChartSpec } from "~/lib/schema";
import { THEMES, NAMED_PALETTES, type ThemeName, type ChartTheme } from "~/lib/theme";
import { FONT_STACKS } from "./chart-constants"; // or wherever you put FONT_STACKS


export interface ResolvedStyle {
	background: string;
	titleColor: string;
	subtitleColor: string;
	axisLabelColor: string;
	gridColor: string;
	palette: string[];
	titleFontFamily: string;   // ← add
	bodyFontFamily: string;    // ← add
}

export function resolveStyle(spec: ChartSpec, tokenTheme: ChartTheme) {
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

	const titleFontFamily = FONT_STACKS[st?.titleFont ?? base.titleFont ?? "sans"];
	const bodyFontFamily = FONT_STACKS[st?.bodyFont ?? base.bodyFont ?? "sans"];

	return {
		background: st?.backgroundColor ?? base.background,   // override wins over theme
		titleColor: base.title,
		subtitleColor: base.subtitle,
		axisLabelColor: base.axisLabel,
		gridColor: st?.gridColor ?? base.grid,
		palette,
		titleFontFamily,
		bodyFontFamily,
	};
}

export function legendConfig(style, s: ResolvedStyle, topOffset) {
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
	return { show: true, textStyle: { color: s.subtitleColor }, ...placement };
}

export function applyAxisStyle(axis, s: ResolvedStyle, axisStyle?) {
	const isValue = axis.type === "value";
	return {
		...axis,
		...(isValue && axisStyle?.min !== undefined ? { min: axisStyle.min } : {}),
		...(isValue && axisStyle?.max !== undefined ? { max: axisStyle.max } : {}),
		show: axisStyle?.visible !== false,
		axisTick: { show: false },
		axisLine: { show: false, lineStyle: { color: s.gridColor } },
		axisLabel: {
			color: s.axisLabelColor,
			fontWeight: 500,
			fontSize: 11,
		},
		...(axisStyle?.position ? { position: axisStyle.position } : {}),
		...(isValue
			? { splitLine: { lineStyle: { color: s.gridColor, type: "dashed" as const, opacity: 0.6 } } }
			: { splitLine: { show: false } }),
		...(axisStyle?.label
			? {
				name: axisStyle.label,
				nameGap: 28,
				nameTextStyle: { color: s.axisLabelColor, fontWeight: 500 },
			}
			: {}),
	};
}

export function resolveLabel(showValues, horizontal, s: ResolvedStyle) {
	const vl = showValues;
	const cfg = vl === true ? { show: true } : vl && typeof vl === "object" ? vl : null;
	if (!cfg) return undefined;
	return {
		show: cfg.show !== false,
		formatter: function (cfg) {
			return Number(cfg.value).toFixed(2);
		},
		position: cfg.position ?? (horizontal ? "right" : "top"),
		color: cfg.color ?? s.axisLabelColor,
		fontWeight: 500,
		fontSize: 11,
	};
}