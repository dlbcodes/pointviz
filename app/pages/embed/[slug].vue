<!-- app/pages/embed/[slug].vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { chartApiService } from "~/services/ChartApiService";
import { compileToECharts } from "~/lib/compile";
import {
    resolveTheme,
    THEMES,
    type ChartTheme,
    type ThemeName,
} from "~/lib/theme";
import type { ChartSpec } from "~/lib/schema";

definePageMeta({ layout: "embed" });

const route = useRoute();
const slug = route.params.slug as string;

const { data } = await useAsyncData(`embed-chart-${slug}`, () =>
    chartApiService.getPublic(slug),
);

const spec = computed<ChartSpec | null>(() => data.value?.spec ?? null);

const theme = ref<ChartTheme | null>(null);
onMounted(() => {
    theme.value = resolveTheme();
});

const option = computed(() =>
    spec.value && theme.value
        ? compileToECharts(spec.value, theme.value)
        : null,
);

const chartBackground = computed(() => {
    if (!spec.value) return undefined;
    const override = spec.value.style?.backgroundColor;
    if (override) return override;
    const themeName = (spec.value.style?.theme ?? "default") as ThemeName;
    const bg = THEMES[themeName].background;
    return bg === "transparent" ? undefined : bg;
});

// Robots: don't index embed URLs (they're iframe targets, not pages).
useSeoMeta({ robots: "noindex, nofollow" });
</script>

<template>
    <div
        class="flex h-full w-full flex-col overflow-hidden"
        :class="chartBackground ? '' : 'bg-bg-base'"
        :style="chartBackground ? { backgroundColor: chartBackground } : {}"
    >
        <ClientOnly>
            <VChart
                v-if="option"
                :option="option"
                autoresize
                class="min-h-0 w-full flex-1"
            />
            <div v-else class="flex flex-1 items-center justify-center">
                <span class="text-xs text-text-tertiary"
                    >Chart unavailable</span
                >
            </div>
        </ClientOnly>

        <!-- Tiny attribution link — the growth hook inside the embed -->
        <a
            :href="`/c/${slug}`"
            target="_blank"
            rel="noopener"
            class="shrink-0 px-3 pb-2 text-right text-[10px] font-mono text-text-tertiary/70 transition-colors hover:text-text-tertiary"
        >
            Made with PointViz ↗
        </a>
    </div>
</template>
