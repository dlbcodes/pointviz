// app/composables/useChartExport.ts
import { ref } from "vue";
import { THEMES, type ThemeName } from "~/lib/theme";
import type { ChartSpec } from "~/lib/schema";

// Shared handle to the ECharts instance — ChartStage registers it, ExportMenu uses it.
const chartInstance = ref<{ getDataURL: (opts: object) => string } | null>(null);

export function useChartExport() {
	function registerChart(instance: unknown) {
		chartInstance.value = instance as { getDataURL: (opts: object) => string };
	}

	// The background the image should export on: explicit override → theme bg → white.
	function effectiveBackground(spec: ChartSpec | null): string {
		const override = spec?.style?.backgroundColor;
		if (override) return override;
		const themeName = (spec?.style?.theme ?? "default") as ThemeName;
		const bg = THEMES[themeName].background;
		return bg === "transparent" ? "#ffffff" : bg;
	}

	function downloadPng(opts: { scale?: number; filename?: string; background?: string }) {
		const chart = chartInstance.value;
		if (!chart) return false;

		const url = chart.getDataURL({
			type: "png",
			pixelRatio: opts.scale ?? 2,
			backgroundColor: opts.background ?? "#ffffff",
		});

		const a = document.createElement("a");
		a.href = url;
		a.download = opts.filename ?? "chart.png";
		a.click();
		return true;
	}

	async function copyPng(opts: { scale?: number; background?: string }): Promise<boolean> {
		const chart = chartInstance.value;
		if (!chart) return false;

		const url = chart.getDataURL({
			type: "png",
			pixelRatio: opts.scale ?? 2,
			backgroundColor: opts.background ?? "#ffffff",
		});

		try {
			const blob = await (await fetch(url)).blob(); // data URL → Blob
			await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
			return true;
		} catch {
			return false; // clipboard blocked, unsupported, or not https
		}
	}

	return { registerChart, downloadPng, copyPng, effectiveBackground, hasChart: chartInstance };
}