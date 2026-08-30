// app/lib/theme.ts

/* ─── Named series palettes (series colors only) ─────────────────── */
export const NAMED_PALETTES = {
	"colorblind-safe": ["#0072b2", "#e69f00", "#009e73", "#cc79a7", "#56b4e9", "#d55e00"],
	warm: ["#d1495b", "#edae49", "#f4a259", "#e76f51", "#c1666b"],
	cool: ["#0d9488", "#2563eb", "#7c3aed", "#0891b2", "#4f46e5"],
	"monochrome-teal": ["#134e4a", "#0f766e", "#14b8a6", "#5eead4", "#99f6e4"],
} as const;

export type PaletteName = keyof typeof NAMED_PALETTES;
export const PALETTE_NAMES = Object.keys(NAMED_PALETTES) as PaletteName[];

/* ─── Complete themes (background + text + grid + palette) ────────── */
export interface ChartThemeDef {
	background: string;
	title: string;
	subtitle: string;
	axisLabel: string;
	grid: string;
	palette: string[]; // [] = pull from design tokens at compile time
}

export const THEMES = {
	default: {
		background: "transparent",
		title: "#141414",
		subtitle: "#777072",
		axisLabel: "#777072",
		grid: "#e0e0e0",
		palette: [],
	},
	datapoint: {
		background: "#f5f4ed",
		title: "#141414",
		subtitle: "#777072",
		axisLabel: "#777072",
		grid: "#e0e0e0",
		palette: [
			"#003d5c", "#31497e", "#674f95", "#a14e9a",
			"#d44c8d", "#f9596f", "#ff7a47", "#ffa600",
		],
	},
} as const satisfies Record<string, ChartThemeDef>;

export type ThemeName = keyof typeof THEMES;
export const THEME_NAMES = Object.keys(THEMES) as ThemeName[];

/* ─── Runtime resolution of the default palette from CSS tokens ───── */
// ⚠️ Must match the token names in your main.css :root block.
const DEFAULT_TOKEN_VARS = [
	"--color-chart-1", "--color-chart-2", "--color-chart-3",
	"--color-chart-4", "--color-chart-5",
];
const DEFAULT_FALLBACK = ["#0d9488", "#f59e0b", "#6366f1", "#ec4899", "#84cc16"];

export interface ChartTheme {
	defaultPalette: string[];
}

function readVar(name: string): string | null {
	if (typeof window === "undefined") return null;
	const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	return v || null;
}

export function resolveTheme(): ChartTheme {
	return {
		defaultPalette: DEFAULT_TOKEN_VARS.map((v, i) => readVar(v) ?? DEFAULT_FALLBACK[i]),
	};
}