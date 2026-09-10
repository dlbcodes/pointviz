// app/lib/style-presets.ts

export interface StylePreset {
	id: string;
	name: string;
	description: string;   // short, for the dropdown
	instruction: string;   // the full prompt sent to the AI
}

export const STYLE_PRESETS = [
	{
		id: "neon-dark",
		name: "Neon Dark",
		description: "Dark, high-contrast, vibrant neon accents",
		bgColor: "#15171E",
		colors: ["#FA114F", "#1EEAEF", "#92E82A"],
		instruction: `Apply a dark, high-contrast dashboard style.
- Background: deep charcoal slate (#15171E).
- Colors: vibrant neon — pink (#FA114F), cyan (#1EEAEF), lime green (#92E82A), orange (#FF9500), electric purple (#A855F7), and bright yellow (#FFD60A).
- Typography: clean display font for the title (large, bright white #FAFAFA); monospace for body text and axis labels; subtitle large and light gray (#A3A3A3).
- Axes: hide the Y-axis completely, keep the X-axis visible.
- Bars: stacked with medium rounded corners and rounded ends.
- Labels: legend at the top; show the total on the bars, hide individual segment values.`,
	},
	{
		id: "editorial-warm",
		name: "Editorial Warm",
		description: "Salmon background, serif, classic print feel",
		bgColor: "#FFF1E5",
		colors: ["#990F3D", "#0F5499", "#D4A017"],
		instruction: `Apply a premium, warm editorial style.
- Background: warm salmon paper tone (#FFF1E5).
- Colors: Claret (#990F3D), Deep Blue (#0F5499), Warm Gold (#D4A017), Slate Gray (#5A6B7C), Deep Charcoal (#222222), and Muted Olive (#6B705C).
- Typography: a classic serif font (like Georgia) for the title and subtitle; clean, small sans-serif for axis labels and data values.
- Axes: hide the top, right, and left axis borders; keep only a thin bottom axis line. Add very faint, thin horizontal gridlines.
- Bars: sharp, square corners (zero border radius), relatively thin.
- Labels: prefer direct labels on the bars or at the end of lines; if a legend is needed, place it at the top.`,
	},
	{
		id: "minimalist-report",
		name: "Minimalist Report",
		description: "White background, sharp corners, strict minimalism",
		bgColor: "#FFFFFF",
		colors: ["#E3120B", "#006BA2", "#1A1A1A"],
		instruction: `Apply a strict, minimalist report style.
- Background: pure white (#FFFFFF).
- Colors: signature palette — Red (#E3120B), Dark Blue (#006BA2), Light Blue (#3EBCD2), Medium Gray (#8C8C8C), Black (#1A1A1A), and Muted Gold (#D4A017).
- Typography: clean, bold sans-serif (like Arial or Helvetica) for the title (left-aligned, black); smaller gray sans-serif for the subtitle.
- Axes: hide the top, right, and left axis borders completely. Keep only a thin, solid black bottom axis line with small downward tick marks. Add very faint, thin horizontal gridlines.
- Bars: sharp, square corners (zero border radius), relatively thin.
- Labels: avoid standard legend boxes; prefer direct labels. Hide individual value labels on the bars to keep it minimalist. Always include a small, light gray source line at the bottom.`,
	},
	{
		id: "modern-tech",
		name: "Modern Tech",
		description: "Clean light mode, indigo/blue, monospace data",
		bgColor: "#F8FAFC",
		colors: ["#4F46E5", "#0EA5E9", "#10B981"],
		instruction: `Apply a clean, modern tech dashboard style.
- Background: pure white (#FFFFFF) or very faint off-white (#F8FAFC).
- Colors: Vibrant Indigo (#4F46E5), Bright Sky Blue (#0EA5E9), Punchy Emerald Green (#10B981), Amber (#F59E0B), Rose (#F43F5E), and Slate (#64748B).
- Typography: clean sans-serif for the title (bold, dark slate #0F172A). Crucially, use a monospace font for the Y-axis numbers and legend values to give it a technical feel.
- Axes: hide the top, right, and left axis borders. Add very faint, light gray horizontal grid lines.
- Bars/Lines: if using areas, make them slightly transparent with smooth, curved lines. If using bars, use slightly rounded corners.
- Labels: place the legend at the top. Show values clearly.`,
	},
	{
		id: "terminal-glow",
		name: "Terminal Glow",
		description: "Dark, neon green, monospace, log-scale aesthetic",
		bgColor: "#050A08",
		colors: ["#39FF14", "#FCEE0A", "#FF007F"],
		instruction: `Apply a dark, retro-futuristic "terminal" dashboard style.
- Background: deep black-green (#050A08).
- Colors: Neon Green (#39FF14), Cyber Yellow (#FCEE0A), Hot Pink (#FF007F), Cyan (#00FFFF), Electric Purple (#BC13FE), and a muted dark green for baselines (#1A4D2E).
- Typography: strictly monospace font (like JetBrains Mono or Courier) for everything. Title bright green. Subtitle in muted green.
- Axes: hide the top, right, and left axis borders. Add faint, dark green gridlines. Use a logarithmic scale for the Y-axis if the data spans multiple orders of magnitude.
- Lines/Bars: if using lines, make them thick and add a subtle glow or shadow effect. Use a dashed, muted line for baselines or trendlines.
- Labels: legend at the top left. Place direct text labels at the end of the lines.`,
	},
	{
		id: "soft-pill",
		name: "Soft Pill",
		description: "Warm off-white, pill-shaped bars, ultra-minimalist",
		bgColor: "#F4F2EE",
		colors: ["#4A4A45", "#8C8C85", "#F26419"],
		instruction: `Apply a warm, ultra-minimalist editorial style.
- Background: warm off-white / light gray (#F4F2EE).
- Colors: Charcoal Olive (#4A4A45), Warm Gray (#8C8C85), Accent Orange (#F26419), Slate Blue (#5B7C99), Muted Teal (#4A8B8C), and Dusty Rose (#C27A7A).
- Typography: clean, bold sans-serif (like Inter or Helvetica) for the title (left-aligned, dark charcoal). Small, light gray sans-serif for the subtitle and axis labels.
- Axes: hide the top, right, and left axis borders completely. Keep only a very faint, thin bottom axis line. Hide vertical gridlines entirely.
- Bars: maximum border radius (pill shape / fully rounded ends). Make them relatively thick.
- Labels: hide standard legends. If highlighting a specific data point (like the last bar), make it an outline/hollow with a small colored dot above it.`,
	},
];