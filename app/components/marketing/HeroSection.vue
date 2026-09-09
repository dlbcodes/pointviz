<!-- app/components/HeroSection.vue -->
<script setup lang="ts">
import { Button, Badge } from "@dlbcodes/ui";
</script>

<template>
    <div
        class="relative flex flex-col items-center gap-16 px-6 pt-24 pb-28 lg:pt-32"
    >
        <!-- dotted grid bg -->
        <div
            class="pointer-events-none absolute inset-0 bg-size-[20px_20px] bg-[radial-gradient(circle,rgba(0,0,0,0.045)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
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

            <GuideFrame>
                <h1
                    class="font-display text-3xl font-semibold text-text-primary sm:text-6xl sm:text-nowrap"
                >
                    Charts you describe, not draw
                </h1>
            </GuideFrame>
            <p class="text-lg text-text-secondary text-balance">
                Paste your data and build charts by describing them in plain
                language. No formatting menus, no design skills, no redoing it
                when the data changes.
            </p>

            <div class="flex items-center gap-x-8">
                <Button
                    variant="primary"
                    size="lg"
                    to="/signup"
                    data-umami-event="hero_cta_click"
                >
                    Try it — it's free
                    <AnimatedArrow />
                </Button>
                <NuxtLink
                    to="/examples"
                    class="group inline-flex items-center gap-x-2 font-mono text-current"
                    data-umami-event="hero_click_see_examples"
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

        <!-- The animated demo, extracted -->
        <AnimatedChartDemo />
    </div>
</template>
