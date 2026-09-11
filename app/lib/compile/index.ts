import type { ChartSpec } from "~/lib/schema";
import type { ChartTheme } from "~/lib/theme";
import { resolveStyle } from "./style";
import { buildBrandmark } from "./brandmark";
import { compileScatter } from "./scatter";
import { compilePie } from "./pie";
import { compileCartesian } from "./cartesian";
import type { CompileContext } from "./context";
import { compileDumbbell } from "./compile-dumbbell";

export function compileToECharts(
	spec: ChartSpec,
	tokenTheme: ChartTheme,
	opts: { brandmark?: boolean; preview?: boolean } = {},
) {
	const s = resolveStyle(spec, tokenTheme);
	const preview = opts.preview ?? false;
	const showBrandmark = !preview && (opts.brandmark ?? true);

	const ctx: CompileContext = {
		s,
		preview,
		style: spec.style,
		brandmark: showBrandmark ? buildBrandmark() : undefined,
	};

	// Route to the correct compiler
	if (spec.type === "scatter") return compileScatter(spec, ctx);
	if (spec.type === "pie" || spec.type === "donut") return compilePie(spec, ctx);
	if (spec.type === "dumbbell") return compileDumbbell(spec as any, ctx); // <-- Add this

	return compileCartesian(spec as any, ctx);
}