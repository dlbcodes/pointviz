// app/composables/useResizable.ts
import { useEventListener, useLocalStorage } from "@vueuse/core";
import { ref } from "vue";

export function useResizable(opts: {
	min: number;
	max: number;
	initial: number;
	key?: string;
	side?: "left" | "right"; // which edge the handle is on
}) {
	const side = opts.side ?? "left"; // left sidebar's handle is on its right edge (default)
	const width = opts.key ? useLocalStorage(opts.key, opts.initial) : ref(opts.initial);
	const dragging = ref(false);

	function startResize(e: PointerEvent) {
		dragging.value = true;
		const startX = e.clientX;
		const startW = width.value;

		const stopMove = useEventListener(window, "pointermove", (ev: PointerEvent) => {
			// Left panel grows when dragging right; right panel grows when dragging left.
			const delta = ev.clientX - startX;
			const next = side === "right" ? startW - delta : startW + delta;
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