// app/composables/useChartSpec.ts
import * as z from "zod";
import { computed, watch, onMounted } from "vue";
import { useRoute } from "#app";
import { ChartSpecSchema, type ChartSpec } from "~/lib/schema";
import { decodeSpec } from "~/lib/shareLink"; // <-- USE YOUR EXISTING FUNCTION!

const MAX_HISTORY = 50;

export function useChartSpec() {
	const route = useRoute();
	const rawInput = useState<string>("chart:raw", () => "");

	const past = useState<string[]>("chart:past", () => []);
	const future = useState<string[]>("chart:future", () => []);
	const currentChartId = useState<string | null>("chart:currentId", () => null);

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

	function applyHash() {
		// Safely get the hash on the client
		const hash = typeof window !== "undefined" ? window.location.hash : route.hash;

		if (!hash || hash.length < 2) {
			return;
		}

		try {
			const encoded = hash.slice(1); // Remove the '#'

			// 1. Use your robust, versioned decoder!
			const result = decodeSpec(encoded);

			// 2. If it's valid, convert the spec back to a formatted JSON string for the editor
			if (result.ok) {
				const jsonString = JSON.stringify(result.spec, null, 2);

				if (jsonString !== rawInput.value) {
					console.log("Hash data is different. Applying...");

					// If history is empty, it's the initial load. Set directly.
					if (past.value.length === 0) {
						rawInput.value = jsonString;
					} else {
						// If they clicked "Remix" while already using the app, treat as a new action
						loadSpec(jsonString);
					}
				}
			} else {
				console.warn("Failed to decode share link:", result.reason);
			}
		} catch (e) {
			console.warn("Failed to parse chart from URL hash:", e);
		}
	}

	// Apply on mount (Guaranteed to run on client, catching the initial load)
	onMounted(() => {
		applyHash();
	});

	// Watch for subsequent changes (e.g., clicking a Remix link while on the page)
	watch(
		() => route.hash,
		() => {
			applyHash();
		}
	);

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

	function loadSpec(json: string, opts?: { keepIdentity?: boolean }) {
		if (json === rawInput.value) return;
		past.value.push(rawInput.value);
		if (past.value.length > MAX_HISTORY) past.value.shift();
		future.value = [];
		if (!opts?.keepIdentity) currentChartId.value = null;
		rawInput.value = json;
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
		currentChartId
	};
}