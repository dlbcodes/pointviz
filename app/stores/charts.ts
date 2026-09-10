// app/stores/charts.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { watchDebounced } from "@vueuse/core";
import { chartApiService } from "~/services/ChartApiService";
import type { ChartSummary } from "~~/shared/types/chart";
import { ChartSpecSchema } from "~/lib/schema";

export const STARTER_JSON = `{
  "type": "bar",
  "stack": false,
  "title": "Weekly Training Volume by Activity",
  "subtitle": "Active minutes per week across running, cycling, strength, and yoga over a 12-week program.",
  "categories": [
    "Week 1",
    "Week 2",
    "Week 3",
    "Week 4",
    "Week 5",
    "Week 6"
  ],
  "series": [
    {
      "name": "Running (min)",
      "values": [120, 135, 150, 140, 165, 180]
    },
    {
      "name": "Cycling (min)",
      "values": [60, 75, 90, 105, 120, 135]
    },
    {
      "name": "Strength (min)",
      "values": [90, 90, 105, 105, 120, 120]
    },
    {
      "name": "Yoga (min)",
      "values": [45, 45, 60, 60, 75, 75]
    }
  ],
  "style": {
    "colors": [  "#E63946", "#1D3557", "#2A9D8F", "#E9C46A"],
	"legend": {
      "visible": true,
      "position": "top"
    },
	 "yAxis": {
      "visible": true,
      "position": "right"
    }
  }
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
		// Clear the current chart immediately so the previous one doesn't flash.
		loadSpec("");           // or a "loading" state
		currentChartId.value = null;
		suppressAutosave.value = true;
		const chart = await chartApiService.get(id);
		loadSpec(JSON.stringify(chart.spec, null, 2));
		currentChartId.value = chart.id;
		setTimeout(() => (suppressAutosave.value = false), 100);
	}

	async function duplicateChart(id: string) {
		const source = await chartApiService.get(id); // need the full spec
		const created = await chartApiService.create(
			source.spec,
			source.title ? `${source.title} (copy)` : "Untitled chart",
		);
		savedCharts.value.unshift(created);
		return created;
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
		duplicateChart,
		deleteChart,
		createFromStarter,
		setPublic
	};
});