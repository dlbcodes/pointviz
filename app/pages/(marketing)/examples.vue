<!-- app/pages/examples.vue -->
<script setup lang="ts">
// Define the structure for your examples
interface Example {
    id: string;
    title: string;
    description: string;
    category: string;
    chartType: string;
    imageUrl: string; // You will replace these with actual screenshots or SVGs
}

const examples = [
    {
        id: "government-expenditure",
        title: "Where OECD governments actually spend the money",
        description:
            "Government expenditure by function, as % of total government expenditure, 2023 (32 OECD/EU countries).",
        category: "Economics",
        chartType: "100% Stacked Bar",
        imageUrl: "/templates/government_spending.webp",
    },
    {
        id: "effective-exit-age",
        title: "Effective Exit Age from the Labour Market",
        description:
            "Average effective exit age of sexes, by country, 2022 (or latest available year).",
        category: "Labor & Society",
        chartType: "Horizontal Bar",
        imageUrl: "/templates/exit_age_labour_market.webp",
    },
    {
        id: "income-wealth-inequality",
        title: "Income inequality vs Wealth distribution accross OECD countries",
        description: "Most recent year available and indicator (years vary).",
        category: "Economics",
        chartType: "Scatter Plot",
        imageUrl: "/templates/income_gini_vs_wealth_concentration.webp",
    },
    {
        id: "annual-hours-worked",
        title: "Who Works the Longest Hours",
        description:
            "Average annual hours actually worked per worker, OECD countries, latest available year (mostly 2025).",
        category: "Labor & Society",
        chartType: "Horizontal Bar",
        imageUrl: "/templates/long_worked_hours.webp",
    },
    {
        id: "oecd-aging-population",
        title: "The OECD Is Getting Old",
        description: "Population by age group, OECD total, 1960–2024.",
        category: "Demographics",
        chartType: "Area Chart",
        imageUrl: "/templates/oecd_getting_older.webp",
    },
    {
        id: "wealth-distribution",
        title: "Wealth Distribution by Country",
        description:
            "Share of net worth (%) across OECD countries. Top 1-10% and bottom 90% calculated from OECD top-1%/top-10% shares (2023).",
        category: "Economics",
        chartType: "100% Stacked Bar",
        imageUrl: "/templates/wealth-distribution.webp",
    },
    {
        id: "paycheck-breakdown",
        title: "Where Does Your Paycheck Actually Go?",
        description:
            "Labour cost breakdown for a single worker at the average wage — take-home pay vs. worker and employer taxes, OECD countries (2024).",
        category: "Labor & Society",
        chartType: "100% Stacked Bar",
        imageUrl: "/templates/tax-wedge.webp",
    },
    {
        id: "government-debt",
        title: "Who's Carrying the Most Debt?",
        description:
            "General government gross debt as a percentage of GDP, latest available year per country (mostly 2025).",
        category: "Economics",
        chartType: "Horizontal Bar",
        imageUrl: "/templates/public_debt.webp",
    },
    {
        id: "rd-investment",
        title: "The Innovation Engine: Who Actually Invests in the Future? (R&D Spending)",
        description:
            "R&D expenditure as % of GDP, most recent year per country (mostly 2023–2024).",
        category: "Innovation",
        chartType: "Horizontal Bar",
        imageUrl: "/templates/rd_spending_pct_gdp.webp",
    },
];

const categories = [
    "All",
    "Economics",
    "SaaS & Metrics",
    "Labor & Society",
    "Innovation",
    "Demographics",
];
const activeCategory = ref("All");

const filteredExamples = computed(() => {
    if (activeCategory.value === "All") return examples;
    return examples.filter((ex) => ex.category === activeCategory.value);
});
</script>

<template>
    <div class="min-h-screen py-24 px-6 md:px-10">
        <div class="mx-auto max-w-6xl">
            <!-- Header Section -->
            <div class="text-center mb-16">
                <span
                    class="font-mono text-xs uppercase tracking-widest text-chart-teal"
                >
                    Inspiration
                </span>

                <div class="mb-14 text-center">
                    <div class="relative inline-block px-6 py-2 sm:px-8">
                        <span
                            class="pointer-events-none absolute -top-px left-1/2 h-px w-[110%] -translate-x-1/2 bg-[repeating-linear-gradient(to_right,var(--color-border-subtle)_0_4px,transparent_4px_8px)] [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] sm:w-[140%]"
                        />
                        <span
                            class="pointer-events-none absolute -bottom-px left-1/2 h-px w-[110%] -translate-x-1/2 bg-[repeating-linear-gradient(to_right,var(--color-border-subtle)_0_4px,transparent_4px_8px)] [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] sm:w-[140%]"
                        />
                        <span
                            class="pointer-events-none absolute -left-px top-1/2 h-[130%] w-px -translate-y-1/2 bg-[repeating-linear-gradient(to_bottom,var(--color-border-subtle)_0_4px,transparent_4px_8px)] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] sm:h-[160%]"
                        />
                        <span
                            class="pointer-events-none absolute -right-px top-1/2 h-[130%] w-px -translate-y-1/2 bg-[repeating-linear-gradient(to_bottom,var(--color-border-subtle)_0_4px,transparent_4px_8px)] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] sm:h-[160%]"
                        />
                        <h1
                            class="font-display text-4xl font-semibold tracking-tight sm:text-5xl"
                        >
                            See what you can build
                        </h1>
                    </div>
                    <p
                        class="mt-6 text-lg text-text-secondary max-w-2xl mx-auto"
                    >
                        Explore real-world examples of charts built with
                        PointViz. Find your use case and remix it with your own
                        data.
                    </p>
                </div>
            </div>

            <!-- Category Filters -->
            <div class="flex flex-wrap justify-center gap-3 mb-16">
                <button
                    v-for="cat in categories"
                    :key="cat"
                    @click="activeCategory = cat"
                    :class="[
                        'px-4 py-2 rounded-full font-mono text-sm transition-all duration-200',
                        activeCategory === cat
                            ? 'bg-text-primary text-bg-surface'
                            : 'bg-bg-surface-alt text-text-secondary hover:text-text-primary border border-border-strong',
                    ]"
                >
                    {{ cat }}
                </button>
            </div>

            <!-- Examples Grid -->
            <!-- Examples Grid -->
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
            >
                <NuxtLink
                    v-for="example in filteredExamples"
                    :key="example.id"
                    :to="`/app?template=${example.id}`"
                    class="group relative flex flex-col"
                >
                    <!-- Chart preview: subtle border, image zooms on hover -->
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

                    <!-- Card content -->
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
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="size-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <!-- Empty State (if filter returns nothing) -->
            <div v-if="filteredExamples.length === 0" class="text-center py-20">
                <p class="font-mono text-text-secondary">
                    No examples found in this category yet.
                </p>
            </div>
        </div>
    </div>
</template>
