// app/composables/useChartSpec.ts
import * as z from "zod";
import { ChartSpecSchema, type ChartSpec } from "~/lib/schema";

const MAX_HISTORY = 50;

export function useChartSpec() {
	const rawInput = useState<string>("chart:raw", () => "");

	// Undo/redo stacks — snapshots of rawInput. Shared across the app via useState.
	const past = useState<string[]>("chart:past", () => []);
	const future = useState<string[]>("chart:future", () => []);

	const parsed = computed(() => {
		const text = rawInput.value.trim();
		if (!text) return { spec: null as ChartSpec | null, error: null as string | null };
		let json: unknown;
		try {
			json = JSON.parse(text);
		} catch (e) {
			return { spec: null, error: `Invalid JSON: ${e instanceof Error ? e.message : "parse error"}` };
		}
		const result = ChartSpecSchema.safeParse(json);
		if (!result.success) return { spec: null, error: z.prettifyError(result.error) };
		return { spec: result.data, error: null };
	});

	const spec = computed(() => parsed.value.spec);
	const error = computed(() => parsed.value.error);
	const isEmpty = computed(() => rawInput.value.trim().length === 0);
	const isValid = computed(() => spec.value !== null && error.value === null);
	const title = computed(() => spec.value?.title ?? "");

	const canUndo = computed(() => past.value.length > 0);
	const canRedo = computed(() => future.value.length > 0);

	// The core change primitive: push current state to history, then set the new value.
	// Every source of change (customize, examples, CSV, import, share) calls loadSpec,
	// so instrumenting it here makes undo cover all of them.
	function loadSpec(json: string) {
		if (json === rawInput.value) return; // no-op, don't pollute history
		past.value.push(rawInput.value);
		if (past.value.length > MAX_HISTORY) past.value.shift();
		future.value = []; // a new change invalidates the redo branch
		rawInput.value = json;
	}

	function undo() {
		if (!canUndo.value) return;
		future.value.push(rawInput.value);
		rawInput.value = past.value.pop()!;
	}

	function redo() {
		if (!canRedo.value) return;
		past.value.push(rawInput.value);
		rawInput.value = future.value.pop()!;
	}

	return {
		rawInput,
		spec,
		error,
		title,
		isEmpty,
		isValid,
		loadSpec,
		undo,
		redo,
		canUndo,
		canRedo,
	};
}