<!-- app/pages/(app)/charts/index.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dlbcodes/ui";
import { PhPlus } from "@phosphor-icons/vue";

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
        creating.value = false; // stay on the page on failure; navigation would have left it
    }
}
</script>

<template>
    <div>
        <div class="mb-6 flex items-center justify-between">
            <h1 class="text-xl font-semibold">My charts</h1>
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
            class="rounded-xl border border-dashed border-border-default py-16 text-center"
        >
            <p class="text-text-secondary">No charts yet.</p>
            <button
                class="mt-2 inline-block text-sm font-medium text-chart-teal disabled:opacity-50"
                :disabled="creating"
                @click="createChart"
            >
                {{ creating ? "Creating…" : "Create your first chart →" }}
            </button>
        </div>

        <!-- Chart list -->
        <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <NuxtLink
                v-for="chart in chartStore.savedCharts"
                :key="chart.id"
                :to="`/charts/${chart.id}`"
                class="rounded-xl border border-border-default p-4 transition-colors hover:border-border-strong"
            >
                <p class="truncate font-medium text-text-primary">
                    {{ chart.title || "Untitled chart" }}
                </p>
                <p class="mt-1 text-xs text-text-tertiary">
                    {{ new Date(chart.updatedAt).toLocaleDateString() }}
                </p>
            </NuxtLink>
        </div>
    </div>
</template>
