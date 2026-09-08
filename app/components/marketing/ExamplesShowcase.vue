<!-- app/components/ExamplesShowcase.vue -->
<script setup lang="ts">
import { FEATURED_EXAMPLES } from "~/lib/examples-showcase";
</script>

<template>
    <section class="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <!-- Header: title left, "view all" right -->
        <div class="mb-12 flex items-end justify-between gap-4">
            <div>
                <span
                    class="font-mono text-xs uppercase tracking-widest text-chart-teal"
                >
                    Made with PointViz
                </span>
                <h2
                    class="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl"
                >
                    See what people build
                </h2>
            </div>
            <NuxtLink
                to="/examples"
                class="hidden shrink-0 items-center gap-1.5 font-mono text-sm text-text-secondary transition-colors hover:text-text-primary sm:flex"
            >
                View all examples
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                    />
                </svg>
            </NuxtLink>
        </div>

        <!-- Featured examples grid — same card treatment as /examples -->
        <div class="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
            <NuxtLink
                v-for="example in FEATURED_EXAMPLES"
                :key="example.id"
                :to="`/app?template=${example.id}`"
                class="group relative flex flex-col"
            >
                <div
                    class="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-border-subtle bg-bg-surface transition-colors group-hover:border-border-default"
                >
                    <img
                        :src="example.imageUrl"
                        :alt="example.title"
                        loading="lazy"
                        class="h-full w-full object-cover object-left-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                </div>
                <div class="flex flex-col pt-4">
                    <div class="mb-2 flex items-center justify-between">
                        <span
                            class="font-mono text-xs uppercase tracking-wide text-chart-teal"
                            >{{ example.chartType }}</span
                        >
                        <span class="font-mono text-xs text-text-secondary">{{
                            example.category
                        }}</span>
                    </div>
                    <h3
                        class="font-display text-lg font-semibold tracking-tight text-text-primary transition-colors group-hover:text-chart-teal"
                    >
                        {{ example.title }}
                    </h3>
                </div>
            </NuxtLink>
        </div>

        <!-- Mobile "view all" (since the header one is hidden on mobile) -->
        <div class="mt-10 text-center sm:hidden">
            <NuxtLink to="/examples" class="font-mono text-sm text-chart-teal">
                View all examples →
            </NuxtLink>
        </div>
    </section>
</template>
