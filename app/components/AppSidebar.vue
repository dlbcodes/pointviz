<!-- components/AppSidebar.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { PhBracketsCurly, PhFile, PhTable } from "@phosphor-icons/vue";

type Tab = "examples" | "csv" | "json";

const activeTab = ref<Tab>("examples");
const { rawInput, error, isValid } = useChartSpec();

const examples = [
	{
		name: "Government Debt by Creditor",
		description:
			"General government gross debt held by domestic vs. external creditors (% of GDP).",
		json: `{
  "type": "bar",
  "orientation": "horizontal",
  "stack": true,
  "title": "General Government Gross Debt by Creditor Residence",
  "subtitle": "% of GDP, latest available quarter",
  "style": {
    "theme": "datapoint",
    "legend": { "position": "top" }
  },
  "categories": ["Japan", "United Kingdom", "Italy", "United States", "Canada"],
  "series": [
    { "name": "domestic", "values": [178.1, 121.4, 90.0, 106.4, 95.5] },
    { "name": "external", "values": [26.1, 27.4, 48.9, 31.5, 29.9] }
  ]
}`,
	},
	{
		name: "Unpaid Work by Sex",
		description: "Average hours per day spent on unpaid care and domestic work.",
		json: `{
  "type": "bar",
  "title": "Unpaid Work by Sex",
  "subtitle": "Average hours per day",
  "categories": ["South Korea", "Japan", "Sweden"],
  "series": [
    { "name": "male", "values": [0.8, 0.9, 2.1] },
    { "name": "female", "values": [3.5, 3.2, 2.3] }
  ]
}`,
	},
];

const tabs = [
	{ id: "examples" as const, label: "Examples", icon: PhFile },
	{ id: "csv" as const, label: "CSV", icon: PhTable },
	{ id: "json" as const, label: "JSON", icon: PhBracketsCurly },
];

function loadExample(json: string) {
	rawInput.value = json;
	activeTab.value = "json";
}
</script>

<template>
	<aside class="flex w-90 shrink-0 flex-col border-r border-border-default">
		<!-- Tabs (data entry only) -->
		<div class="flex border-b border-border-default">
			<button
				v-for="tab in tabs"
				:key="tab.id"
				@click="activeTab = tab.id"
				class="flex flex-1 items-center justify-center gap-x-1 px-4 py-4 text-[13px] transition-colors border-b-2 font-mono tracking-tight"
				:class="
					activeTab === tab.id
						? 'border-chart-teal text-chart-teal'
						: 'border-transparent text-text-tertiary hover:text-text-secondary'
				"
			>
				<component :is="tab.icon" />
				{{ tab.label }}
			</button>
		</div>

		<!-- Scrollable content -->
		<div class="flex-1 overflow-y-auto p-5">
			<!-- EXAMPLES -->
			<div v-if="activeTab === 'examples'" class="space-y-3">
				<h3 class="mb-4 text-xs font-mono font-medium tracking-wider text-text-tertiary">
					Choose a Template
				</h3>
				<div
					v-for="(example, index) in examples"
					:key="index"
					@click="loadExample(example.json)"
					class="group cursor-pointer rounded-lg border border-border-default p-4 transition-all hover:border-border-strong hover:bg-bg-base"
				>
					<h4
						class="text-xs uppercase font-mono tracking-[-0.0125em] font-medium text-text-primary group-hover:text-chart-teal transition-colors"
					>
						{{ example.name }}
					</h4>
					<p class="mt-1 text-xs font-mono text-text-tertiary leading-relaxed">
						{{ example.description }}
					</p>
					<div
						class="mt-3 flex items-center text-xs font-medium text-chart-teal opacity-0 transition-opacity group-hover:opacity-100"
					>
						Load this example &rarr;
					</div>
				</div>
			</div>

			<!-- CSV -->
			<CsvPanel v-if="activeTab === 'csv'" />

			<!-- JSON -->
			<div v-if="activeTab === 'json'">
				<h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
					Data Source (JSON)
				</h3>
				<textarea
					v-model="rawInput"
					class="w-full h-96 rounded-lg border p-3 text-xs font-mono text-text-primary focus:outline-none focus:ring-2 resize-none"
					:class="
						error
							? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500'
							: 'border-border-default focus:ring-chart-teal/20 focus:border-chart-teal'
					"
					placeholder="Paste your PointViz JSON here..."
				></textarea>
				<p v-if="error" class="mt-1.5 text-xs font-mono text-danger-500">
					{{ error }}
				</p>
			</div>
		</div>

		<footer
			class="shrink-0 flex items-center justify-between border-t border-border-default px-6 py-2 text-xs text-text-tertiary"
		>
			<span>Status: {{ error ? "Invalid spec" : isValid ? "Data loaded" : "Ready" }}</span>
			<span>PointViz Engine v0.1 • @dlbcodes/ui</span>
		</footer>
	</aside>
</template>