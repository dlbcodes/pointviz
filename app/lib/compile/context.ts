import type { ResolvedStyle } from "./style";
import type { ChartSpec } from "~/lib/schema";

export interface CompileContext {
	s: ResolvedStyle;
	preview: boolean;
	brandmark: ReturnType<typeof import("./brandmark").buildBrandmark> | undefined;
	style: ChartSpec["style"];
}