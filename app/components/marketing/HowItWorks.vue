<!-- app/components/HowItWorks.vue -->
<script setup lang="ts">
import { PhClipboard, PhChatText, PhShareNetwork } from "@phosphor-icons/vue";

const steps = [
    {
        n: "01",
        icon: PhClipboard,
        title: "Paste your data",
        description:
            "Drop in a CSV, a spreadsheet range, or messy numbers. No formatting, no cleanup — PointViz figures out the shape.",
    },
    {
        n: "02",
        icon: PhChatText,
        title: "Describe the chart",
        description:
            'Say what you want in plain language — "make it a horizontal bar, sorted, with a colorblind palette." The AI builds it, and rebuilds it when you ask for changes.',
    },
    {
        n: "03",
        icon: PhShareNetwork,
        title: "Share or embed",
        description:
            "Export as an image, get a public link, or embed the live chart in your blog or docs. One click, no account gymnastics.",
    },
];
</script>

<template>
    <section class="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <!-- Section header -->
        <div class="mb-16 text-center">
            <span
                class="font-mono text-xs uppercase tracking-widest text-chart-teal"
            >
                How it works
            </span>
            <h2
                class="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl"
            >
                From data to chart in three steps
            </h2>
            <p class="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
                No spreadsheet menus, no chart wizards, no redoing it when the
                data changes.
            </p>
        </div>

        <!-- Steps: dashed-guide grid -->
        <div class="grid grid-cols-1 md:grid-cols-3">
            <div
                v-for="(step, i) in steps"
                :key="step.n"
                class="relative flex flex-col gap-4 px-8 py-10"
            >
                <!-- dashed divider between cells (right edge, not on last) -->
                <span
                    v-if="i < steps.length - 1"
                    class="pointer-events-none absolute inset-y-6 -right-px hidden w-px bg-[repeating-linear-gradient(to_bottom,var(--color-border-strong)_0_4px,transparent_4px_8px)] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] md:block"
                />

                <div class="flex items-center gap-3">
                    <span class="font-mono text-sm text-text-tertiary">{{
                        step.n
                    }}</span>
                    <span
                        class="h-px flex-1 bg-[repeating-linear-gradient(to_right,var(--color-border-subtle)_0_4px,transparent_4px_8px)]"
                    />
                    <component
                        :is="step.icon"
                        class="size-6 text-chart-teal"
                        weight="duotone"
                    />
                </div>

                <h3
                    class="font-display text-xl font-semibold text-text-primary"
                >
                    {{ step.title }}
                </h3>
                <p class="text-sm leading-relaxed text-text-secondary">
                    {{ step.description }}
                </p>
            </div>
        </div>
    </section>
</template>
