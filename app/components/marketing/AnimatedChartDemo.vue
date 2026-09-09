<!-- app/components/AnimatedChartDemo.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { compileToECharts } from "~/lib/compile";
import type { ChartSpec } from "~/lib/schema";
import { THEMES, type ThemeName, type ChartTheme } from "~/lib/theme";

const prompts = [
    "make the bars orange",
    "use a bold display headline",
    "go dark",
    "add the OECD average line",
    "show the values and go horizontal",
];

const promptIndex = ref(0);
let timer: ReturnType<typeof setInterval>;
onMounted(() => {
    timer = setInterval(() => {
        promptIndex.value = (promptIndex.value + 1) % prompts.length;
    }, 4600);
});
onUnmounted(() => clearInterval(timer));

interface HeroSpecDraft {
    type: "bar";
    orientation: "vertical" | "horizontal";
    stack: boolean;
    categories: string[];
    series: { name: string; values: number[] }[];
    title?: string;
    subtitle?: string;
    source?: string;
    goals?: { color?: string; label?: string; value: number }[];
    style?: {
        theme?: string;
        legend?: { visible?: boolean; position?: string };
        showValues?: boolean;
        titleFont?: string;
        colors?: string[];
        backgroundColor?: string;
        title?: { size?: string; color?: string };
        subtitle?: { size?: string; color?: string };
    };
}

function baseSpec(): HeroSpecDraft {
    return {
        type: "bar",
        orientation: "vertical",
        stack: false,
        categories: [
            "Mexico",
            "Korea",
            "Portugal",
            "Spain",
            "Germany",
            "Denmark",
        ],
        series: [
            {
                name: "Workers, 50+ hrs/week",
                values: [26.042, 15.441, 9.714, 6.518, 4.998, 3.179],
            },
        ],
        title: "Share of Workers Usually Working 50+ Hours",
        subtitle: "Percentage of workers, 2023-2024",
        source: "OECD, DF_EMP_LNG_USL_WK_HRS",
        style: {
            theme: "default",
            legend: { visible: false, position: "bottom" },
            showValues: false,
        },
    };
}

const spec = computed<HeroSpecDraft>(() => {
    const step = promptIndex.value;
    const s = baseSpec();
    if (!s.style) return s;
    if (step >= 0) s.style.colors = ["#FF9500"];
    if (step >= 1) {
        s.style.titleFont = "display";
        s.style.title = { ...s.style.title, size: "xl" };
    }
    if (step >= 2) {
        s.style.backgroundColor = "#141414";
        s.style.title = { ...s.style.title, color: "#f5f5f5" };
        s.style.subtitle = { color: "#a3a3a3" };
    }
    if (step >= 3)
        s.goals = [
            { color: "#FF9500", label: "OECD avg (12.2)", value: 12.213 },
        ];
    if (step >= 4) {
        s.orientation = "horizontal";
        s.style.showValues = true;
    }
    return s;
});

function token(name: string, fallback: string) {
    if (typeof window === "undefined") return fallback;
    return (
        getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim() || fallback
    );
}
const tokenTheme = {
    defaultPalette: [
        token("--color-chart-teal", "#0f9d8a"),
        token("--color-chart-amber", "#e0a52c"),
        token("--color-chart-coral", "#e07a5f"),
        token("--color-chart-slate", "#5c6b7a"),
    ],
} as ChartTheme;

const option = computed(() =>
    compileToECharts(spec.value as unknown as ChartSpec, tokenTheme, {
        preview: false,
        brandmark: false,
    }),
);

const chartBg = computed(() => {
    const s = spec.value.style;
    if (s?.backgroundColor) return s.backgroundColor;
    const themeName = (s?.theme ?? "default") as ThemeName;
    const bg = THEMES[themeName].background;
    return bg === "transparent" ? undefined : bg;
});
</script>

<template>
    <div class="relative flex w-full max-w-4xl flex-col items-center gap-4">
        <!-- prompt caption -->
        <div
            class="flex items-center gap-2.5 rounded-xl border border-border-default bg-bg-base px-4 py-2.5 font-mono text-sm"
        >
            <span
                class="flex size-5 items-center justify-center rounded-md bg-chart-teal/10 text-chart-teal"
                >›</span
            >
            <Transition
                mode="out-in"
                enter-active-class="transition-all duration-300 ease-out"
                leave-active-class="transition-all duration-200 ease-in"
                enter-from-class="opacity-0 translate-y-1"
                leave-to-class="opacity-0 -translate-y-1"
            >
                <span :key="promptIndex" class="text-text-primary">{{
                    prompts[promptIndex]
                }}</span>
            </Transition>
            <span class="ml-1 h-4 w-px animate-pulse bg-text-tertiary" />
        </div>

        <!-- chart -->
        <div
            class="aspect-4/3 w-full overflow-hidden rounded-2xl border border-border-default p-6 md:aspect-video"
            :class="chartBg ? '' : 'bg-bg-base'"
            :style="chartBg ? { backgroundColor: chartBg } : {}"
        >
            <ClientOnly>
                <VChart :option="option" autoresize class="h-full w-full" />
            </ClientOnly>
        </div>
    </div>
</template>
