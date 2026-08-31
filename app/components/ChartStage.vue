<!-- app/components/ChartStage.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { compileToECharts } from "~/lib/compile";
import { resolveTheme, type ChartTheme } from "~/lib/theme";

const { spec, error, isEmpty, isValid } = useChartSpec();

const theme = ref<ChartTheme | null>(null);
onMounted(() => {
    theme.value = resolveTheme();
});

const option = computed(() =>
    spec.value && theme.value
        ? compileToECharts(spec.value, theme.value)
        : null,
);
</script>

<template>
    <main
        class="flex flex-1 flex-col overflow-hidden bg-[length:20px_20px] bg-[image:radial-gradient(circle,rgba(0,0,0,0.05)_1px,transparent_1px)]"
    >
        <!-- Chart region: grows, scrolls, chart sits toward the top -->
        <div
            class="flex-1 flex flex-col items-center justify-center gap-2 overflow-auto"
        >
            <div
                class="w-full max-w-6xl aspect-video bg-bg-base border border-border-default rounded-xl overflow-hidden"
            >
                <ClientOnly>
                    <VChart
                        v-if="isValid && option"
                        :option="option"
                        autoresize
                        class="h-full w-full"
                    />
                    <div
                        v-else
                        class="flex h-full w-full items-center justify-center"
                    >
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
            </div>

            <!-- Source caption stays with the chart -->
            <p
                v-if="isValid && spec?.source"
                class="w-full max-w-6xl text-right text-xs font-mono text-text-tertiary"
            >
                Source: {{ spec.source }}
            </p>
        </div>

        <!-- Customize dock: pinned to the bottom, wider than the chart -->
        <div v-if="isValid" class="shrink-0 px-8 pb-6 pt-2">
            <CustomizeBar />
        </div>
    </main>
</template>
