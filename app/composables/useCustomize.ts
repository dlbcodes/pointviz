// app/composables/useCustomize.ts
import type { ChartSpec } from "~/lib/schema";

export function useCustomize() {
	const { spec, isValid, loadSpec } = useChartSpec();

	const instruction = ref("");
	const pending = ref(false);
	const customizeError = ref<string | null>(null);

	async function customize() {
		if (!instruction.value.trim() || pending.value) return;
		if (!spec.value) {
			customizeError.value = "Load a valid chart first.";
			return;
		}
		pending.value = true;
		customizeError.value = null;
		try {
			const { raw } = await $fetch<{ spec: ChartSpec; raw: string }>("/api/customize", {
				method: "POST",
				body: { currentSpec: spec.value, instruction: instruction.value },
			});
			loadSpec(raw); // becomes the new current spec → next edit builds on it
			instruction.value = "";
		} catch (e) {
			customizeError.value =
				(e as { data?: { statusMessage?: string } })?.data?.statusMessage ??
				"Couldn't apply that change.";
		} finally {
			pending.value = false;
		}
	}

	// canCustomize gates the UI until there's a valid spec to edit.
	return { instruction, pending, customizeError, customize, canCustomize: isValid };
}