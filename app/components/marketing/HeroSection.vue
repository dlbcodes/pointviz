<!-- app/components/HeroSection.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Button } from "@dlbcodes/ui";
import { PhArrowRight, PhArrowDown } from "@phosphor-icons/vue";

const emit = defineEmits<{ start: [] }>();

const prompts = [
    "make it a line chart",
    "use a colorblind-safe palette",
    "add a target line at 50k",
    "put the legend on top",
    "make it match our brand",
];
const promptIndex = ref(0);
let timer: ReturnType<typeof setInterval>;
onMounted(() => {
    timer = setInterval(() => {
        promptIndex.value = (promptIndex.value + 1) % prompts.length;
    }, 2200);
});
onUnmounted(() => clearInterval(timer));
</script>

<template>
    <div
        class="relative flex h-full flex-col items-center justify-center gap-8 px-6 text-center"
    >
        <!-- dotted-grid background -->
        <div
            class="pointer-events-none absolute inset-0 bg-[length:24px_24px] bg-[radial-gradient(circle,rgba(0,0,0,0.05)_1px,transparent_1px)]"
        />

        <div class="relative flex flex-col items-center gap-7">
            <!-- Eyebrow -->
            <span
                class="rounded-full border border-border-default bg-bg-inverse px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-widest text-text-inverse"
            >
                AI chart builder
            </span>

            <!-- Headline with dashed guide-lines -->
            <div class="relative inline-block px-6 py-5 sm:px-8 sm:py-6">
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
                    class="text-3xl font-semibold tracking-tight text-text-primary sm:text-5xl sm:text-nowrap"
                >
                    Charts you describe, not draw
                </h1>
            </div>

            <p class="max-w-xl text-lg text-text-secondary">
                No menus, no formatting dialogs, no redoing it when the data
                changes. Just say what you want, and watch it happen.
            </p>

            <!-- Rotating prompt -->
            <div
                class="flex h-9 items-center gap-2 rounded-lg bg-bg-subtle px-4 font-mono text-sm text-text-secondary"
            >
                <span class="text-chart-teal">›</span>
                <Transition
                    mode="out-in"
                    enter-active-class="transition-all duration-300"
                    leave-active-class="transition-all duration-200"
                    enter-from-class="opacity-0 translate-y-1"
                    leave-to-class="opacity-0 -translate-y-1"
                >
                    <span :key="promptIndex">{{ prompts[promptIndex] }}</span>
                </Transition>
            </div>

            <Button variant="primary" size="lg" @click="emit('start')">
                Try it — it's free
                <PhArrowRight class="size-4" />
            </Button>

            <!-- Three-step flow -->
            <div
                class="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-xs text-text-tertiary"
            >
                <span>Paste your data</span>
                <PhArrowRight class="size-3 shrink-0" />
                <span>Describe the chart</span>
                <PhArrowRight class="size-3 shrink-0" />
                <span>Share or embed</span>
            </div>
        </div>

        <button
            class="absolute bottom-8 flex flex-col items-center gap-1 text-text-tertiary transition-colors hover:text-text-secondary"
            @click="emit('start')"
        >
            <span class="text-xs">Scroll to start</span>
            <PhArrowDown class="size-4 animate-bounce" />
        </button>
    </div>
</template>
