<!-- app/pages/(app)/charts/index.vue -->
<script setup lang="ts">
import { ref } from "vue";
import {
    Button,
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from "@dlbcodes/ui";
import { PhPlus, PhChartBar } from "@phosphor-icons/vue";

definePageMeta({ layout: "app" });

const chartStore = useChartStore();

onMounted(async () => {
    await chartStore.fetchCharts();
});

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

const value = ref("edited");
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
            <div class="flex items-center gap-x-2">
                <Select v-model="value" class="w-40">
                    <SelectTrigger placeholder="Pick a framework" size="sm" />
                    <SelectContent>
                        <SelectItem value="created" label="Created at"
                            >Created at</SelectItem
                        >
                        <SelectItem value="edited" label="Edit at">
                            Edit at
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant="primary"
                    size="sm"
                    class="whitespace-nowrap"
                    :disabled="creating"
                    @click="createChart"
                >
                    <PhPlus class="size-4" />
                    {{ creating ? "Creating…" : "Create chart" }}
                </Button>
            </div>
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
        <div
            v-else
            class="px-2 md:px-12 grid content-start gap-x-(--column-gap) gap-y-8 pb-20 [--column-gap:20px] [--max-column-count:4] [--min-column-width:300px] [--total-gap-width:calc((var(--max-column-count)-1)*var(--column-gap))] [--max-column-width:calc((100%-var(--total-gap-width))/var(--max-column-count))] grid-cols-[repeat(auto-fill,minmax(max(var(--min-column-width),var(--max-column-width)),1fr))] 720:gap-y-10 720:[--column-gap:24px] 840:[--min-column-width:360px] 1280:[--min-column-width:394px]"
        >
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
