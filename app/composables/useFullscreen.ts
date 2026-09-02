// app/composables/useFullscreen.ts
import { ref, onUnmounted } from "vue";

// Shared target element — ChartStage registers it, the header button triggers it.
const target = ref<HTMLElement | null>(null);

export function useFullscreen() {
	const isFullscreen = ref(false);

	function sync() {
		isFullscreen.value = !!document.fullscreenElement;
	}

	function setTarget(el: HTMLElement | null) {
		target.value = el;
	}

	async function enter() {
		if (!target.value) return;
		try {
			await target.value.requestFullscreen();
		} catch {
			/* denied/unsupported — no-op */
		}
	}
	async function exit() {
		if (document.fullscreenElement) await document.exitFullscreen();
	}
	async function toggle() {
		document.fullscreenElement ? await exit() : await enter();
	}

	if (import.meta.client) {
		document.addEventListener("fullscreenchange", sync);
		onUnmounted(() => document.removeEventListener("fullscreenchange", sync));
	}

	return { isFullscreen, setTarget, enter, exit, toggle };
}