<!-- app/pages/(app)/charts/index.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dlbcodes/ui";
import { PhPlus, PhChartBar } from "@phosphor-icons/vue";

definePageMeta({ layout: "app", middleware: "auth" });

const chartStore = useChartStore();
await chartStore.fetchCharts();

const creating = ref(false);
async function createChart() {
    if (creating.value) return;
    creating.value = true;
    try {
        const chart = await chartStore.createFromStarter();
        await navigateTo(`/charts/${chart.id}`);
    } catch {
        creating.value = false;
    }
}
</script>

<template>
    <div>
        <div class="mb-8 flex items-center justify-between">
            <div>
                <h1 class="text-xl font-semibold">My charts</h1>
                <p class="mt-0.5 text-sm text-text-tertiary">
                    {{ chartStore.savedCharts.length }}
                    {{
                        chartStore.savedCharts.length === 1 ? "chart" : "charts"
                    }}
                </p>
            </div>
            <Button
                variant="primary"
                size="sm"
                :disabled="creating"
                @click="createChart"
            >
                <PhPlus class="size-4" />
                {{ creating ? "Creating…" : "Create chart" }}
            </Button>
        </div>

        <!-- Empty state -->
        <div
            v-if="chartStore.savedCharts.length === 0"
            class="flex flex-col items-center rounded-2xl border border-dashed border-border-default py-20 text-center"
        >
            <div
                class="mb-4 flex size-12 items-center justify-center rounded-full bg-bg-subtle"
            >
                <PhChartBar class="size-6 text-text-tertiary" />
            </div>
            <p class="font-medium text-text-primary">No charts yet</p>
            <p class="mt-1 max-w-xs text-sm text-text-tertiary">
                Create your first chart and it'll show up here.
            </p>
            <Button
                variant="primary"
                size="sm"
                class="mt-4"
                :disabled="creating"
                @click="createChart"
            >
                <PhPlus class="size-4" />
                {{ creating ? "Creating…" : "Create your first chart" }}
            </Button>
        </div>

        <!-- Grid of thumbnails -->
        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ChartCard
                v-for="chart in chartStore.savedCharts"
                :key="chart.id"
                :id="chart.id"
                :title="chart.title"
                :spec="chart.spec"
                :updated-at="chart.updatedAt"
            />
        </div>
    </div>
</template>
