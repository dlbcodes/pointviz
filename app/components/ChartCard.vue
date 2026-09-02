<!-- app/components/ChartCard.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { compileToECharts } from "~/lib/compile";
import { resolveTheme, type ChartTheme } from "~/lib/theme";
import type { ChartSpec } from "~/lib/schema";
import { useTimeAgo } from "@vueuse/core";

const props = defineProps<{
    id: string;
    title: string | null;
    spec: ChartSpec;
    updatedAt: string;
}>();

const theme = ref<ChartTheme | null>(null);
const timeAgo = useTimeAgo(() => new Date(props.updatedAt));

onMounted(() => {
    theme.value = resolveTheme();
});

const option = computed(() =>
    theme.value
        ? compileToECharts(props.spec, theme.value, { preview: true })
        : null,
);
</script>

<template>
    <NuxtLink
        :to="`/charts/${id}`"
        class="group flex flex-col overflow-hidden rounded-xl border border-border-default transition-colors hover:border-border-strong"
    >
        <!-- Thumbnail: a live mini-chart, non-interactive -->
        <div
            class="aspect-16/10 w-full overflow-hidden border-b border-border-default bg-bg-base pointer-events-none"
        >
            <ClientOnly>
                <VChart
                    v-if="option"
                    :option="option"
                    autoresize
                    class="h-full w-full p-2"
                />
            </ClientOnly>
        </div>

        <!-- Meta -->
        <div class="p-3">
            <p
                class="truncate text-sm font-medium text-text-primary group-hover:text-chart-teal transition-colors"
            >
                {{ title || "Untitled chart" }}
            </p>
            <p class="mt-0.5 text-xs text-text-tertiary">
                Last edited {{ timeAgo }}
            </p>
        </div>
    </NuxtLink>
</template>
