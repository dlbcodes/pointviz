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

// Fetch the public chart server-side (SSR) so it renders on first paint + gets OG tags.
const { data, error } = await useAsyncData(`public-chart-${slug}`, () =>
    chartApiService.getPublic(slug),
);

const chart = computed(() => data.value);
const spec = computed<ChartSpec | null>(() => chart.value?.spec ?? null);

// Theme resolves client-side (reads CSS tokens).
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

// "Remix" link — open THIS chart in the builder via the spec-in-URL inbound decoder.
const remixHref = computed(() =>
    spec.value ? `/#${encodeSpec(spec.value)}` : "/",
);

// SEO / social preview — a shared chart should have a rich unfurl.
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
    <div class="w-full max-w-6xl">
        <!-- Not found -->
        <div
            v-if="error || !chart"
            class="rounded-xl border border-border-default py-20 text-center"
        >
            <p class="text-text-secondary">This chart isn't available.</p>
            <NuxtLink
                to="/"
                class="mt-3 inline-block text-sm font-medium text-chart-teal"
            >
                Make your own →
            </NuxtLink>
        </div>

        <template v-else>
            <!-- The chart -->
            <div
                class="flex aspect-video w-full flex-col overflow-hidden rounded-xl border border-border-default"
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
                        class="min-h-0 w-full flex-1 p-4"
                    />
                    <div v-else class="flex flex-1 items-center justify-center">
                        <span class="text-sm text-text-tertiary"
                            >Loading chart…</span
                        >
                    </div>
                </ClientOnly>

                <p
                    v-if="spec?.source"
                    class="shrink-0 px-4 pb-3 text-left text-xs font-mono text-text-tertiary"
                >
                    Source: {{ spec.source }}
                </p>
            </div>

            <!-- Conversion CTA — the whole point of this page -->
            <div class="mt-6 flex flex-col items-center gap-3 text-center">
                <p class="text-sm font-mono tracking-tight text-text-primary">
                    Made with PointViz — build charts by describing changes in
                    plain English.
                </p>
                <div class="flex items-center gap-2">
                    <NuxtLink :to="remixHref">
                        <Button variant="outline">Remix this chart</Button>
                    </NuxtLink>
                    <NuxtLink to="/">
                        <Button variant="primary">
                            Make your own
                            <PhArrowRight class="size-4" />
                        </Button>
                    </NuxtLink>
                </div>
            </div>
        </template>
    </div>
</template>
