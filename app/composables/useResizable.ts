// app/composables/useResizable.ts
import { useEventListener, useLocalStorage } from "@vueuse/core";
import { ref } from "vue";

export function useResizable(opts: { min: number; max: number; initial: number; key?: string }) {
	// persist width across reloads if a key is given
	const width = opts.key
		? useLocalStorage(opts.key, opts.initial)
		: ref(opts.initial);
	const dragging = ref(false);

	function startResize(e: PointerEvent) {
		dragging.value = true;
		const startX = e.clientX;
		const startW = width.value;

		const stopMove = useEventListener(window, "pointermove", (ev: PointerEvent) => {
			const next = startW + (ev.clientX - startX);
			width.value = Math.min(opts.max, Math.max(opts.min, next));
		});
		const stopUp = useEventListener(window, "pointerup", () => {
			dragging.value = false;
			stopMove();
			stopUp();
		});
	}

	return { width, dragging, startResize };
}