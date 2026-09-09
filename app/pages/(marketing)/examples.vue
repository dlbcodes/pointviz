<!-- app/pages/examples.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import { PhArrowRight } from "@phosphor-icons/vue";
import { EXAMPLES, EXAMPLE_CATEGORIES } from "~/lib/examples-showcase";

definePageMeta({ layout: "default" });

const activeCategory = ref("All");

const filteredExamples = computed(() =>
    activeCategory.value === "All"
        ? EXAMPLES
        : EXAMPLES.filter((ex) => ex.category === activeCategory.value),
);
</script>

<template>
    <div class="min-h-screen px-6 py-24 md:px-10">
        <div class="mx-auto max-w-5xl">
            <!-- Header -->
            <div class="mb-16 text-center">
                <span
                    class="font-mono text-xs uppercase tracking-widest text-chart-teal"
                >
                    Inspiration
                </span>

                <div class="mt-6 flex flex-col items-center">
                    <GuideFrame>
                        <h1
                            class="font-display text-4xl font-semibold tracking-tight sm:text-5xl"
                        >
                            See what you can build
                        </h1>
                    </GuideFrame>
                    <p
                        class="mx-auto mt-6 max-w-2xl text-lg text-text-secondary"
                    >
                        Explore real-world examples of charts built with
                        PointViz. Find your use case and remix it with your own
                        data.
                    </p>
                </div>
            </div>

            <!-- Category filters -->
            <div class="mb-16 flex flex-wrap justify-center gap-3">
                <button
                    v-for="cat in EXAMPLE_CATEGORIES"
                    :key="cat"
                    class="rounded-full px-4 py-2 font-mono text-sm transition-all duration-200"
                    :class="
                        activeCategory === cat
                            ? 'bg-text-primary text-bg-surface'
                            : 'border border-border-subtle text-text-secondary hover:text-text-primary'
                    "
                    @click="activeCategory = cat"
                >
                    {{ cat }}
                </button>
            </div>

            <!-- Examples grid -->
            <div
                class="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
            >
                <NuxtLink
                    v-for="example in filteredExamples"
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
                            class="h-full w-full object-cover object-top-left transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                    </div>

                    <div class="flex grow flex-col pt-4">
                        <div class="mb-2 flex items-center justify-between">
                            <span
                                class="font-mono text-xs uppercase tracking-wide text-chart-teal"
                            >
                                {{ example.chartType }}
                            </span>
                            <span class="font-mono text-xs text-text-secondary">
                                {{ example.category }}
                            </span>
                        </div>

                        <h3
                            class="font-display text-xl font-semibold tracking-tight text-text-primary transition-colors group-hover:text-chart-teal"
                        >
                            {{ example.title }}
                        </h3>
                        <p
                            class="mt-2 grow text-sm leading-relaxed text-text-secondary"
                        >
                            {{ example.description }}
                        </p>

                        <div
                            class="mt-4 flex items-center gap-1.5 font-mono text-sm font-medium text-text-primary"
                        >
                            <span
                                class="underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 group-hover:text-chart-teal group-hover:decoration-chart-teal"
                            >
                                Remix this chart
                            </span>
                            <PhArrowRight
                                class="size-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                            />
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <!-- Empty state -->
            <div v-if="filteredExamples.length === 0" class="py-20 text-center">
                <p class="font-mono text-text-secondary">
                    No examples found in this category yet.
                </p>
            </div>
        </div>
    </div>

    <Cta />
</template>
