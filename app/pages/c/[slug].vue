<!-- app/pages/c/[slug].vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Button } from "@dlbcodes/ui";
import { PhArrowRight } from "@phosphor-icons/vue";
import { chartApiService } from "~/services/ChartApiService";
import { compileToECharts } from "~/lib/compile";
import {
    resolveTheme,
    THEMES,
    type ChartTheme,
    type ThemeName,
} from "~/lib/theme";
import { encodeSpec } from "~/lib/shareLink";
import type { ChartSpec } from "~/lib/schema";

definePageMeta({ layout: "public" });

const route = useRoute();
const slug = route.params.slug as string;

const { data, error } = await useAsyncData(`public-chart-${slug}`, () =>
    chartApiService.getPublic(slug),
);

const chart = computed(() => data.value);
const spec = computed<ChartSpec | null>(() => chart.value?.spec ?? null);

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

const remixHref = computed(() =>
    spec.value ? `/#${encodeSpec(spec.value)}` : "/",
);

useSeoMeta({
    title: () =>
        chart.value?.title
            ? `${chart.value.title} · PointViz`
            : "Chart · PointViz",
    description: () => spec.value?.subtitle ?? "A chart made with PointViz.",
    ogTitle: () => chart.value?.title ?? "Chart · PointViz",
    ogDescription: () =>
        spec.value?.subtitle ?? "Make your own charts with natural language.",
});
</script>

<template>
    <!-- Full-height column: chart fills, CTA is a compact bottom bar -->
    <div class="flex h-dvh flex-col">
        <!-- Not found -->
        <div
            v-if="error || !chart"
            class="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center"
        >
            <p class="text-text-secondary">This chart isn't available.</p>
            <NuxtLink to="/">
                <Button variant="primary">
                    Make your own
                    <PhArrowRight class="size-4" />
                </Button>
            </NuxtLink>
        </div>

        <template v-else>
            <!-- Chart fills all remaining space, adapts to screen shape -->
            <div
                class="flex min-h-0 flex-1 flex-col p-4 sm:p-6 rounded-3xl"
                :class="chartBackground ? '' : 'bg-bg-base'"
                :style="
                    chartBackground ? { backgroundColor: chartBackground } : {}
                "
            >
                <ClientOnly>
                    <VChart
                        v-if="option"
                        :option="option"
                        autoresize
                        class="min-h-0 w-full flex-1"
                    />
                    <div v-else class="flex flex-1 items-center justify-center">
                        <span class="text-sm text-text-tertiary"
                            >Loading chart…</span
                        >
                    </div>
                </ClientOnly>

                <p
                    v-if="spec?.source"
                    class="shrink-0 pt-2 text-left text-xs font-mono text-text-tertiary"
                >
                    Source: {{ spec.source }}
                </p>
            </div>

            <!-- Compact CTA bar — pinned at bottom, doesn't eat chart space -->
            <div class="shrink-0 bg-bg-base px-4 py-3">
                <div
                    class="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-2"
                >
                    <p
                        class="text-center text-xs font-mono tracking-tight text-text-secondary sm:text-left"
                    >
                        Made with PointViz — build charts by describing changes
                        in plain English.
                    </p>
                    <div class="flex w-full gap-2 sm:w-auto">
                        <NuxtLink :to="remixHref" class="flex-1 sm:flex-none">
                            <Button
                                variant="outline"
                                size="sm"
                                class="w-full sm:w-auto"
                                >Remix</Button
                            >
                        </NuxtLink>
                        <NuxtLink to="/" class="flex-1 sm:flex-none">
                            <Button
                                variant="primary"
                                size="sm"
                                class="w-full sm:w-auto"
                            >
                                Make your own
                                <PhArrowRight class="size-4" />
                            </Button>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
