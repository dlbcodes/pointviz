// app/stores/charts.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { watchDebounced } from "@vueuse/core";
import { chartApiService } from "~/services/ChartApiService";
import type { ChartSummary } from "~~/shared/types/chart";
import { ChartSpecSchema } from "~/lib/schema";

export const STARTER_JSON = `{
  "type": "bar",
  "title": "Untitled chart",
  "categories": ["A", "B", "C"],
  "series": [{ "name": "Series 1", "values": [10, 20, 15] }]
}`;

export const useChartStore = defineStore("charts", () => {
	const { spec, loadSpec, currentChartId } = useChartSpec();

	const savedCharts = ref<ChartSummary[]>([]);
	const loading = ref(false);
	const saving = ref(false);
	const lastSavedAt = ref<Date | null>(null);
	const suppressAutosave = ref(false);

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
			const updated = await chartApiService.update(currentChartId.value, {
				spec: spec.value,
				title,
			});
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
		// Don't autosave the spec we're about to load (it's already what's in the DB).
		suppressAutosave.value = true;
		loadSpec(JSON.stringify(chart.spec, null, 2)); // loadSpec clears currentChartId…
		currentChartId.value = chart.id; // …so we re-attach it here, after loading.
		// Re-enable after the debounced watch has had its chance to fire-and-skip.
		setTimeout(() => (suppressAutosave.value = false), 1600);
	}

	async function deleteChart(id: string) {
		await chartApiService.remove(id);
		savedCharts.value = savedCharts.value.filter((c) => c.id !== id);
		if (currentChartId.value === id) currentChartId.value = null;
	}

	async function createFromStarter() {
		const starterSpec = ChartSpecSchema.parse(JSON.parse(STARTER_JSON));
		const chart = await chartApiService.create(starterSpec, "Untitled chart");
		savedCharts.value.unshift(chart);
		currentChartId.value = chart.id;
		return chart;
	}

	async function setPublic(id: string, isPublic: boolean) {
		const updated = await chartApiService.update(id, { isPublic });
		const i = savedCharts.value.findIndex((c) => c.id === id);
		if (i !== -1) savedCharts.value[i] = updated;
	}

	// ── Autosave: sync a SAVED chart's changes back, debounced ──
	watchDebounced(
		spec, // the valid, parsed spec — never fires on invalid/mid-edit state
		async (current) => {
			if (suppressAutosave.value) return; // skip the write right after openChart
			if (!currentChartId.value || !current) return; // only saved charts
			saving.value = true;
			try {
				await chartApiService.update(currentChartId.value, { spec: current });
				lastSavedAt.value = new Date();
				const i = savedCharts.value.findIndex((c) => c.id === currentChartId.value);
				if (i !== -1) savedCharts.value[i].updatedAt = lastSavedAt.value.toISOString();
			} catch {
				// silent — a failed autosave shouldn't interrupt; manual Save still available
			} finally {
				saving.value = false;
			}
		},
		{ debounce: 1500, deep: true },
	);

	return {
		savedCharts,
		currentChartId,
		loading,
		saving,
		lastSavedAt,
		fetchCharts,
		saveCurrent,
		openChart,
		deleteChart,
		createFromStarter,
		setPublic
	};
});