// app/stores/charts.ts
import { defineStore } from "pinia";
import { chartApiService } from "~/services/ChartApiService";
import type { ChartSummary } from "~~/shared/types/chart";

export const useChartStore = defineStore("charts", () => {
	const { spec, loadSpec } = useChartSpec();

	const savedCharts = ref<ChartSummary[]>([]);
	const currentChartId = ref<string | null>(null);
	const loading = ref(false);

	async function fetchCharts() {
		loading.value = true;
		try {
			savedCharts.value = await chartApiService.list();
		} finally {
			loading.value = false;
		}
	}

	// Create if new, update if this working chart is already saved.
	async function saveCurrent(title?: string) {
		if (!spec.value) return null;
		if (currentChartId.value) {
			const updated = await chartApiService.update(currentChartId.value, { spec: spec.value, title });
			// refresh the list entry
			const i = savedCharts.value.findIndex((c) => c.id === updated.id);
			if (i !== -1) savedCharts.value[i] = updated;
			return updated;
		}
		const created = await chartApiService.create(spec.value, title);
		savedCharts.value.unshift(created);
		currentChartId.value = created.id;
		return created;
	}

	async function openChart(id: string) {
		const chart = await chartApiService.get(id);
		loadSpec(JSON.stringify(chart.spec, null, 2)); // into the existing seam
		currentChartId.value = chart.id;
	}

	async function deleteChart(id: string) {
		await chartApiService.remove(id);
		savedCharts.value = savedCharts.value.filter((c) => c.id !== id);
		if (currentChartId.value === id) currentChartId.value = null;
	}

	// When the user starts a fresh chart (loads an example, etc.), detach from saved identity.
	function markUnsaved() {
		currentChartId.value = null;
	}

	return { savedCharts, currentChartId, loading, fetchCharts, saveCurrent, openChart, deleteChart, markUnsaved };
});