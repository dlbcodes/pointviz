<!-- app/components/CtaSection.vue -->
<script setup lang="ts">
withDefaults(
    defineProps<{
        title?: string;
        buttonLabel?: string;
        to?: string;
    }>(),
    {
        title: "Ready to visualize your own data?",
        buttonLabel: "Create your chart",
        to: "/app",
    },
);
</script>

<template>
    <section class="relative max-lg:overflow-x-clip">
        <!-- Full-width dashed hairlines above and below the whole section -->
        <span
            class="pointer-events-none absolute inset-x-0 -top-px z-10 h-px bg-[repeating-linear-gradient(to_right,var(--color-border-strong)_0_4px,transparent_4px_8px)] mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
            aria-hidden="true"
        />
        <span
            class="pointer-events-none absolute inset-x-0 -bottom-px z-10 h-px bg-[repeating-linear-gradient(to_right,var(--color-border-strong)_0_4px,transparent_4px_8px)] mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
            aria-hidden="true"
        />

        <div class="relative mx-auto max-w-360">
            <!-- Side dashed rules at the card edges -->
            <span
                class="pointer-events-none absolute -inset-y-12 -left-px z-10 w-px bg-[repeating-linear-gradient(to_bottom,var(--color-border-strong)_0_4px,transparent_4px_8px)] mask-[linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
                aria-hidden="true"
            />
            <span
                class="pointer-events-none absolute -inset-y-12 -right-px z-10 w-px bg-[repeating-linear-gradient(to_bottom,var(--color-border-strong)_0_4px,transparent_4px_8px)] mask-[linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
                aria-hidden="true"
            />

            <div
                class="rounded-xl px-6 py-24 md:px-10 bg-bg-surface/20 bg-size-[20px_20px] bg-[radial-gradient(circle,rgba(0,0,0,0.1)_1px,transparent_1px)]"
            >
                <div
                    class="mx-auto flex max-w-5xl flex-col items-center text-center"
                >
                    <span
                        class="font-mono text-xs uppercase tracking-widest text-chart-teal"
                    >
                        Start now
                    </span>
                    <h2
                        class="font-display text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-6xl"
                    >
                        {{ title }}
                    </h2>
                </div>

                <!-- Full-width breakout button — dashed rules run edge to edge -->
                <div class="relative -mx-6 mt-12 md:-mx-10">
                    <span
                        class="pointer-events-none absolute -inset-x-16 top-0 z-10 h-px bg-[repeating-linear-gradient(to_right,var(--color-border-strong)_0_4px,transparent_4px_8px)] mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
                        aria-hidden="true"
                    />
                    <span
                        class="pointer-events-none absolute -inset-x-16 bottom-0 z-10 h-px bg-[repeating-linear-gradient(to_right,var(--color-border-strong)_0_4px,transparent_4px_8px)] mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
                        aria-hidden="true"
                    />

                    <NuxtLink
                        to="/signup"
                        :aria-label="buttonLabel"
                        class="group flex h-28 w-full items-center justify-center gap-2 overflow-hidden rounded-[56px] bg-brand-100 font-mono text-3xl font-semibold tracking-tight text-text-inverse transition-[border-radius] duration-300 ease-out hover:rounded-none md:h-32 md:rounded-[64px] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    >
                        {{ buttonLabel }}
                        <AnimatedArrow />
                    </NuxtLink>
                </div>

                <p
                    class="mt-6 text-center font-mono text-sm tracking-wide text-text-secondary"
                >
                    It takes less than 30 seconds. Free to use, no credit card
                    required.
                </p>
            </div>
        </div>
    </section>
</template>
