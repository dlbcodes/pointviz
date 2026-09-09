<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
    Button,
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    Skeleton,
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from "@dlbcodes/ui";
import { PhPlus, PhChartBar } from "@phosphor-icons/vue";

definePageMeta({ layout: "app" });

const chartStore = useChartStore();

const loading = ref(true);
onMounted(async () => {
    try {
        await chartStore.fetchCharts();
    } finally {
        loading.value = false;
    }
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

// Sort — default to created (newest first)
const sortBy = ref<"created" | "edited">("created");

const sortedCharts = computed(() => {
    const field = sortBy.value === "created" ? "createdAt" : "updatedAt";
    // copy before sorting so we don't mutate the store's array
    return [...chartStore.savedCharts].sort(
        (a, b) => new Date(b[field]).getTime() - new Date(a[field]).getTime(),
    );
});
</script>

<template>
    <div>
        <!-- Header -->
        <div class="mb-8 flex items-center justify-between">
            <div>
                <h1 class="text-base md:text-xl font-semibold">My charts</h1>
                <p class="mt-0.5 text-sm text-text-tertiary">
                    {{ chartStore.savedCharts.length }}
                    {{
                        chartStore.savedCharts.length === 1 ? "chart" : "charts"
                    }}
                </p>
            </div>
            <div class="flex items-center gap-x-2">
                <Select v-model="sortBy" class="w-40 hidden md:flex">
                    <SelectTrigger placeholder="Sort by" size="sm" />
                    <SelectContent>
                        <SelectItem value="created" label="Created">
                            Date created
                        </SelectItem>
                        <SelectItem value="edited" label="Edited">
                            Last edited
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant="primary"
                    size="sm"
                    class="whitespace-nowrap h-9"
                    :disabled="creating"
                    @click="createChart"
                >
                    <PhPlus class="size-4" />
                    {{ creating ? "Creating…" : "Create chart" }}
                </Button>
            </div>
        </div>
        <!-- End Header -->

        <!-- Loading -->
        <div
            v-if="loading"
            class="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
            <div v-for="n in 8" :key="n">
                <Skeleton
                    class="aspect-16/10 w-full rounded-3xl bg-bg-surface"
                />
                <Skeleton class="mt-3 h-4 w-2/3 rounded bg-bg-surface" />
                <Skeleton class="mt-2 h-3 w-1/3 rounded bg-bg-surface" />
            </div>
        </div>
        <!-- End Loading -->

        <!-- Empty state -->
        <Empty v-else-if="chartStore.savedCharts.length === 0">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <PhChartBar class="size-6 text-text-tertiary" />
                </EmptyMedia>
                <EmptyTitle>No charts yet </EmptyTitle>
                <EmptyDescription>
                    Create your first chart and it'll show up here.
                </EmptyDescription>
                <EmptyContent>
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
                </EmptyContent>
            </EmptyHeader>
        </Empty>
        <!-- End Empty state -->

        <!-- Chart grid -->
        <div
            v-else
            class="px-2 md:px-12 grid content-start gap-x-(--column-gap) gap-y-8 pb-20 [--column-gap:20px] [--max-column-count:4] [--min-column-width:300px] [--total-gap-width:calc((var(--max-column-count)-1)*var(--column-gap))] [--max-column-width:calc((100%-var(--total-gap-width))/var(--max-column-count))] grid-cols-[repeat(auto-fill,minmax(max(var(--min-column-width),var(--max-column-width)),1fr))] 720:gap-y-10 720:[--column-gap:24px] 840:[--min-column-width:360px] 1280:[--min-column-width:394px]"
        >
            <ChartCard
                v-for="chart in sortedCharts"
                :key="chart.id"
                :id="chart.id"
                :title="chart.title"
                :spec="chart.spec"
                :updated-at="chart.updatedAt"
            />
        </div>
        <!-- End Chart grid -->
    </div>
</template>
