<!-- app/components/ChartStage.vue -->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { Button } from "@dlbcodes/ui";
import { PhArrowCounterClockwise, PhArrowClockwise } from "@phosphor-icons/vue";
import { compileToECharts } from "~/lib/compile";
import {
    resolveTheme,
    THEMES,
    type ChartTheme,
    type ThemeName,
} from "~/lib/theme";

const { setTarget } = useFullscreen();
const stageEl = ref<HTMLElement>();

const { spec, error, isEmpty, isValid, undo, redo, canUndo, canRedo } =
    useChartSpec();
const { registerChart } = useChartExport();

const userStore = useUserStore();
const isPro = computed(() => userStore.profile?.plan === "PRO");

const chartRef = ref();
watch(chartRef, (v) => {
    if (v) registerChart(v);
});

const theme = ref<ChartTheme | null>(null);
onMounted(() => {
    theme.value = resolveTheme();
    if (stageEl.value) setTarget(stageEl.value);
});

const option = computed(() =>
    spec.value && theme.value
        ? compileToECharts(spec.value, theme.value, { brandmark: !isPro.value })
        : null,
);

// Effective background: explicit override → theme background → none (card default shows).
const chartBackground = computed(() => {
    if (!spec.value) return undefined;
    const override = spec.value.style?.backgroundColor;
    if (override) return override;
    const themeName = (spec.value.style?.theme ?? "default") as ThemeName;
    const bg = THEMES[themeName].background;
    return bg === "transparent" ? undefined : bg;
});

// Undo/redo keyboard shortcuts (skip when typing in inputs — native undo wins there).
function onKeydown(e: KeyboardEvent) {
    const t = e.target as HTMLElement;
    if (t.tagName === "TEXTAREA" || t.tagName === "INPUT") return;

    if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
    } else if (
        (e.metaKey || e.ctrlKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
    ) {
        e.preventDefault();
        redo();
    }
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
    <main
        class="relative flex flex-1 flex-col overflow-hidden bg-bg-surface/20 bg-size-[20px_20px] bg-[radial-gradient(circle,rgba(0,0,0,0.05)_1px,transparent_1px)]"
    >
        <!-- Undo/redo toolbar — top-right overlay, only when there's a chart -->
        <div
            v-if="isValid"
            class="absolute right-4 top-3 z-10 flex items-center gap-0.5 rounded-lg border border-border-default bg-bg-base p-0.5 shadow-sm"
        >
            <Button
                variant="ghost"
                size="icon"
                :disabled="!canUndo"
                aria-label="Undo"
                @click="undo"
            >
                <PhArrowCounterClockwise class="size-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                :disabled="!canRedo"
                aria-label="Redo"
                @click="redo"
            >
                <PhArrowClockwise class="size-4" />
            </Button>
        </div>

        <!-- Chart region: grows, scrolls, chart sits toward the top -->
        <div
            class="flex flex-1 flex-col items-center justify-center gap-2 overflow-auto"
        >
            <div
                ref="stageEl"
                class="flex aspect-video w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-border-default"
                :class="chartBackground ? '' : 'bg-bg-base'"
                :style="
                    chartBackground ? { backgroundColor: chartBackground } : {}
                "
            >
                <ClientOnly>
                    <VChart
                        v-if="isValid && option"
                        ref="chartRef"
                        :option="option"
                        autoresize
                        class="min-h-0 w-full flex-1 p-4"
                    />
                    <div v-else class="flex flex-1 items-center justify-center">
                        <div class="space-y-2 text-center">
                            <div class="text-sm font-medium text-text-tertiary">
                                Chart Canvas
                            </div>
                            <div class="text-xs text-text-tertiary/60">
                                {{
                                    isEmpty
                                        ? "Waiting for data…"
                                        : error
                                          ? "Fix spec to render"
                                          : "Ready to render"
                                }}
                            </div>
                        </div>
                    </div>
                </ClientOnly>

                <p
                    v-if="isValid && spec?.source"
                    class="shrink-0 px-4 pb-3 text-left text-xs font-mono text-text-tertiary"
                >
                    Source: {{ spec.source }}
                </p>
            </div>
        </div>

        <!-- Customize dock -->
        <div v-if="isValid" class="shrink-0 px-8 pb-6 pt-2">
            <CustomizeBar />
        </div>
    </main>
</template>
