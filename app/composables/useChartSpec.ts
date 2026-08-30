// app/composables/useChartSpec.ts
import * as z from "zod";
import { ChartSpecSchema, type ChartSpec } from "~/lib/schema";

interface ParseResult {
	spec: ChartSpec | null;
	error: string | null;
}

export function useChartSpec() {
	const rawInput = useState<string>("chart:raw", () => "");

	const parsed = computed<ParseResult>(() => {
		const text = rawInput.value.trim();
		if (!text) return { spec: null, error: null };

		// Stage 1: JSON syntax
		let json: unknown;
		try {
			json = JSON.parse(text);
		} catch (e) {
			const msg = e instanceof Error ? e.message : "parse error";
			return { spec: null, error: `Invalid JSON: ${msg}` };
		}

		// Stage 2: schema / semantic validity
		const result = ChartSpecSchema.safeParse(json);
		if (!result.success) {
			return { spec: null, error: z.prettifyError(result.error) };
		}

		return { spec: result.data, error: null };
	});

	const spec = computed(() => parsed.value.spec);
	const error = computed(() => parsed.value.error);
	const isEmpty = computed(() => rawInput.value.trim().length === 0);
	const isValid = computed(() => spec.value !== null && error.value === null);
	const title = computed(() => spec.value?.title ?? "");

	function loadSpec(json: string) {
		rawInput.value = json;
	}

	return { rawInput, spec, error, title, isEmpty, isValid, loadSpec };
}