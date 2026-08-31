<!-- app/components/ChartStage.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { compileToECharts } from "~/lib/compile";
import { resolveTheme, type ChartTheme } from "~/lib/theme";
import { THEMES, type ThemeName } from "~/lib/theme";

const { spec, error, isEmpty, isValid } = useChartSpec();
const { registerChart } = useChartExport();
const chartRef = ref();

watch(chartRef, (v) => {
    if (v) registerChart(v);
});

const theme = ref<ChartTheme | null>(null);
onMounted(() => {
    theme.value = resolveTheme();
});

const option = computed(() =>
    spec.value && theme.value
        ? compileToECharts(spec.value, theme.value)
        : null,
);

// The chart's effective background: explicit override → theme background → none (let card default show).
const chartBackground = computed(() => {
    if (!spec.value) return undefined;
    const override = spec.value.style?.backgroundColor;
    if (override) return override;
    const themeName = (spec.value.style?.theme ?? "default") as ThemeName;
    const bg = THEMES[themeName].background;
    return bg === "transparent" ? undefined : bg;
});
</script>

<template>
    <main
        class="flex flex-1 flex-col overflow-hidden bg-bg-surface/20 bg-size-[20px_20px] bg-[radial-gradient(circle,rgba(0,0,0,0.05)_1px,transparent_1px)]"
    >
        <!-- Chart region: grows, scrolls, chart sits toward the top -->
        <div
            class="flex-1 flex flex-col items-center justify-center gap-2 overflow-auto"
        >
            <div
                class="w-full max-w-6xl aspect-video flex flex-col border border-border-default rounded-xl overflow-hidden"
                :class="chartBackground ? '' : 'bg-bg-base'"
                :style="
                    chartBackground ? { backgroundColor: chartBackground } : {}
                "
            >
                <ClientOnly>
                    <!-- Chart fills the growing space -->
                    <VChart
                        v-if="isValid && option"
                        ref="chartRef"
                        :option="option"
                        autoresize
                        class="min-h-0 flex-1 w-full p-4"
                    />
                    <div v-else class="flex flex-1 items-center justify-center">
                        <div class="text-center space-y-2">
                            <div class="text-text-tertiary text-sm font-medium">
                                Chart Canvas
                            </div>
                            <div class="text-text-tertiary/60 text-xs">
                                {{
                                    isEmpty
                                        ? "Waiting for JSON data..."
                                        : error
                                          ? "Fix spec to render"
                                          : "Ready to render"
                                }}
                            </div>
                        </div>
                    </div>
                </ClientOnly>

                <!-- Source caption: inside the card, below the chart, not in the chart's padding -->
                <p
                    v-if="isValid && spec?.source"
                    class="shrink-0 px-4 pb-3 text-left text-xs font-mono text-text-tertiary"
                >
                    Source: {{ spec.source }}
                </p>
            </div>
        </div>

        <!-- Customize dock: pinned to the bottom, wider than the chart -->
        <div v-if="isValid" class="shrink-0 px-8 pb-6 pt-2">
            <CustomizeBar />
        </div>
    </main>
</template>
