<!-- app/components/HeroSection.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Button, Badge } from "@dlbcodes/ui";
import { PhArrowRight, PhArrowDown } from "@phosphor-icons/vue";

import { compileToECharts } from "~/lib/compile";
import type { ChartSpec } from "~/lib/schema";
import type { ChartTheme } from "~/lib/theme";

import { THEMES, type ThemeName } from "~/lib/theme";

const emit = defineEmits<{ start: [] }>();

// Each step below is a real, valid mutation of a ChartSpec — the same
// shape ChartBuilder passes to compileToECharts. This is deliberately
// NOT hand-rolled ECharts config: the hero should render through the
// exact same pipeline as the real product, or it risks demoing
// something the tool doesn't actually do.
const prompts = [
    "add the OECD average line",
    "make it horizontal",
    "show the values on each bar",
    "put the legend on top",
    "switch to the datapoint theme",
];

const promptIndex = ref(0);
let timer: ReturnType<typeof setInterval>;

onMounted(() => {
    timer = setInterval(() => {
        promptIndex.value = (promptIndex.value + 1) % prompts.length;
    }, 4600);
});
onUnmounted(() => clearInterval(timer));

// ChartSpec is a union (cartesian bar/line/area/pie/donut vs. scatter —
// see the TS errors you hit). We only ever build the bar/cartesian shape
// here, so this draft type is deliberately narrower than the full union:
// it lets us assign goals/orientation/style freely while mutating, and
// we cast to the real ChartSpec exactly once, at the compile call below.
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
    };
}

// Trimmed, real subset of the "50+ hour workweek" dataset — same one
// that performed on Reddit. Six countries keeps a ~280px hero chart
// legible; the full 46-country version is for the actual post, not this demo.
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

// Accumulate effects as the steps cycle, same as before — by the last
// step the chart looks meaningfully different from where it started.
const spec = computed<HeroSpecDraft>(() => {
    const step = promptIndex.value;
    const s = baseSpec();

    if (step >= 0) {
        s.goals = [
            { color: "#ff7a47", label: "OECD avg (12.2)", value: 12.213 },
        ];
    }
    if (step >= 1) {
        s.orientation = "horizontal";
    }
    if (step >= 2 && s.style) {
        s.style.showValues = true;
    }
    if (step >= 3 && s.style) {
        s.style.legend = { visible: true, position: "top" };
    }
    if (step >= 4 && s.style) {
        s.style.theme = "datapoint";
    }

    return s;
});

// compileToECharts needs the app's design-token theme as its second
// argument (only `defaultPalette` is actually read when style.theme is
// "default" — see resolveStyle in compile.ts). If ChartBuilder gets this
// from a composable (e.g. useChartTheme()), swap this for that so the
// hero can't drift from the real token values.
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

// preview:false keeps legend/showValues actually toggleable (preview mode
// forces legend off); brandmark:false keeps the "Made with PointViz"
// badge from cluttering a ~280px hero card — it's redundant here anyway,
// the whole page is already branded.
//
// Single cast to the real ChartSpec, right at the boundary where it's
// consumed — everything upstream stays typed as the narrower draft so
// TS can actually check the mutations above.
const option = computed(() =>
    compileToECharts(spec.value as unknown as ChartSpec, tokenTheme, {
        preview: false,
        brandmark: false,
    }),
);

const chartBg = computed(() => {
    const s = spec.value.style;
    const override = s?.backgroundColor;
    if (override) return override;
    const themeName = (s?.theme ?? "default") as ThemeName;
    const bg = THEMES[themeName].background;
    return bg === "transparent" ? undefined : bg;
});
</script>

<template>
    <div
        class="relative flex flex-col items-center gap-16 px-6 pt-24 pb-28 lg:pt-32"
    >
        <!-- dotted grid bg, faded at edges via mask -->
        <div
            class="pointer-events-none absolute inset-0 bg-size-[20px_20px] bg-[radial-gradient(circle,rgba(0,0,0,0.045)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
        />

        <!-- Copy -->
        <div
            class="relative flex max-w-2xl flex-col items-center gap-6 text-center"
        >
            <Badge
                class="bg-amber-400 border-amber-500 text-text-primary font-mono text-[11px] font-semibold uppercase tracking-widest"
            >
                AI chart builder
            </Badge>

            <div class="relative inline-block px-6 sm:px-8 py-2">
                <span
                    class="pointer-events-none absolute -top-px left-1/2 h-px w-[110%] -translate-x-1/2 bg-[repeating-linear-gradient(to_right,var(--color-border-strong)_0_4px,transparent_4px_8px)] [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] sm:w-[140%]"
                />
                <span
                    class="pointer-events-none absolute -bottom-px left-1/2 h-px w-[110%] -translate-x-1/2 bg-[repeating-linear-gradient(to_right,var(--color-border-strong)_0_4px,transparent_4px_8px)] [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] sm:w-[140%]"
                />
                <span
                    class="pointer-events-none absolute -left-px top-1/2 h-[130%] w-px -translate-y-1/2 bg-[repeating-linear-gradient(to_bottom,var(--color-border-strong)_0_4px,transparent_4px_8px)] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] sm:h-[160%]"
                />
                <span
                    class="pointer-events-none absolute -right-px top-1/2 h-[130%] w-px -translate-y-1/2 bg-[repeating-linear-gradient(to_bottom,var(--color-border-strong)_0_4px,transparent_4px_8px)] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] sm:h-[160%]"
                />

                <h1
                    class="font-display text-3xl font-semibold text-text-primary sm:text-6xl sm:text-nowrap"
                >
                    Charts you describe, not draw
                </h1>
            </div>
            <p class="text-lg text-text-secondary text-balance">
                Paste your data and build charts by describing them in plain
                language. No formatting menus, no design skills, no redoing it
                when the data changes.
            </p>

            <div class="flex items-center gap-x-8">
                <Button variant="primary" size="lg" @click="emit('start')">
                    Try it — it's free
                    <AnimatedArrow />
                </Button>
                <NuxtLink
                    to="/examples"
                    class="group inline-flex items-center gap-x-2 font-mono text-current"
                >
                    <span
                        class="relative after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100"
                    >
                        See examples
                    </span>

                    <AnimatedArrow />
                </NuxtLink>
            </div>
        </div>

        <!-- Chart + prompt caption -->
        <!-- Chart + prompt caption -->
        <div class="relative flex w-full max-w-4xl flex-col items-center gap-4">
            <!-- Prompt caption — now ABOVE the chart -->
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

            <!-- Chart -->
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
    </div>

    <HowItWorks />

    <ExamplesShowcase />

    <Cta />
</template>
