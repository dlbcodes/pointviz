<!-- app/components/StyleCarousel.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { PhCaretLeft, PhCaretRight } from "@phosphor-icons/vue";
import { Button } from "@dlbcodes/ui";

const styles = [
    { src: "/showcase/ft_style.png", label: "Editorial warm" },
    { src: "/showcase/apple_style.png", label: "Neon dark" },
    { src: "/showcase/customer_traffic.png", label: "Customer traffic" },
    { src: "/showcase/mrr_growth.png", label: "MRR growth" },
    { src: "/showcase/ecommerce_revenue.png", label: "E-commerce revenue" },
    { src: "/showcase/economist_style.png", label: "Economist style" },
    { src: "/showcase/government_funding.png", label: "Economist style" },
    { src: "/showcase/soft_pill.png", label: "Soft pill" },
];

const active = ref(0);
const n = styles.length;

const paused = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

const INTERVAL = 3500;

function startTimer() {
    stopTimer();
    timer = setInterval(() => {
        if (!paused.value) advance(1);
    }, INTERVAL);
}
function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
}

// Core move — used by both autoplay and manual clicks.
function advance(dir: number) {
    active.value = (active.value + dir + n) % n;
}

// Manual navigation restarts the timer (so it doesn't auto-advance
// right after the user clicked).
function next() {
    advance(1);
    startTimer();
}
function prev() {
    advance(-1);
    startTimer();
}
function goTo(i: number) {
    active.value = i;
    startTimer();
}

onMounted(startTimer);
onUnmounted(stopTimer);

function offset(i: number): number {
    let diff = i - active.value;
    if (diff > n / 2) diff -= n;
    if (diff < -n / 2) diff += n;
    return diff;
}

function slideStyle(i: number) {
    const o = offset(i);
    const abs = Math.abs(o);
    if (abs > 1) {
        return {
            transform: `translateX(${o * 60}%) scale(0.1)`,
            opacity: "0",
            zIndex: 0,
            pointerEvents: "none" as const,
        };
    }
    return {
        transform: `translateX(${o * 62}%) scale(${o === 0 ? 1 : 0.52})`,
        opacity: o === 0 ? "1" : "0.8",
        zIndex: o === 0 ? 10 : 5,
    };
}
</script>

<template>
    <section
        class="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-bg-surface bg-size-[20px_20px] bg-[radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] px-6 py-10"
    >
        <div class="mb-10 text-center">
            <span
                class="font-mono text-xs uppercase tracking-widest text-text-secondary"
            >
                Any style you want
            </span>
            <h2
                class="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl"
            >
                One tool, every look
            </h2>
        </div>

        <div
            class="relative flex h-75 items-center justify-center sm:h-105"
            @mouseenter="paused = true"
            @mouseleave="paused = false"
        >
            <div class="relative h-full w-full perspective-[1000px]">
                <div
                    v-for="(style, i) in styles"
                    :key="i"
                    class="absolute left-1/2 top-1/2 aspect-video w-[55%] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border-default bg-bg-subtle p-1 shadow-sm transition-all duration-500 ease-out"
                    :style="slideStyle(i)"
                >
                    <img
                        :src="style.src"
                        :alt="style.label"
                        class="h-full w-full rounded-xl object-cover object-top-left"
                        loading="lazy"
                    />
                    <div
                        v-if="offset(i) === 0"
                        class="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border-default bg-bg-base/90 px-3 py-1 font-mono text-xs text-text-primary backdrop-blur"
                    >
                        {{ style.label }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Arrows (centered row) -->
        <div class="mt-6 flex justify-center gap-3">
            <button
                class="flex size-10 items-center justify-center rounded-full border border-border-default bg-bg-base/90 backdrop-blur transition-colors hover:bg-bg-subtle"
                aria-label="Previous"
                @click="prev"
            >
                <PhCaretLeft class="size-5" />
            </button>
            <button
                class="flex size-10 items-center justify-center rounded-full border border-border-default bg-bg-base/90 backdrop-blur transition-colors hover:bg-bg-subtle"
                aria-label="Next"
                @click="next"
            >
                <PhCaretRight class="size-5" />
            </button>
        </div>

        <!-- CTA (centered) -->
        <div class="mt-10 flex justify-center">
            <Button variant="primary" size="lg" to="/signup">
                Try it — it's free!
                <AnimatedArrow />
            </Button>
        </div>
    </section>
</template>
