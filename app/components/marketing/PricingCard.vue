<!-- app/components/PricingCard.vue -->
<script setup lang="ts">
import { Button, Badge } from "@dlbcodes/ui";
import { PhCheck, PhLightning } from "@phosphor-icons/vue";
import type { PricingTier } from "~/lib/pricing";

defineProps<{ tier: PricingTier }>();
const emit = defineEmits<{ cta: [tier: PricingTier] }>();
</script>

<template>
    <div
        class="relative flex flex-col"
        :class="tier.highlight ? 'bg-bg-base' : ''"
    >
        <!-- outer guide frame — amber on the highlighted card, border-strong otherwise -->
        <span
            class="pointer-events-none absolute -top-px left-1/2 h-px w-[120%] -translate-x-1/2 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
            :class="
                tier.highlight
                    ? 'bg-[repeating-linear-gradient(to_right,var(--color-amber-500)_0_4px,transparent_4px_8px)]'
                    : 'bg-[repeating-linear-gradient(to_right,var(--color-border-strong)_0_4px,transparent_4px_8px)]'
            "
        />
        <span
            class="pointer-events-none absolute -bottom-px left-1/2 h-px w-[120%] -translate-x-1/2 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
            :class="
                tier.highlight
                    ? 'bg-[repeating-linear-gradient(to_right,var(--color-amber-500)_0_4px,transparent_4px_8px)]'
                    : 'bg-[repeating-linear-gradient(to_right,var(--color-border-strong)_0_4px,transparent_4px_8px)]'
            "
        />
        <span
            class="pointer-events-none absolute -left-px top-1/2 h-[120%] w-px -translate-y-1/2 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]"
            :class="
                tier.highlight
                    ? 'bg-[repeating-linear-gradient(to_bottom,var(--color-amber-500)_0_4px,transparent_4px_8px)]'
                    : 'bg-[repeating-linear-gradient(to_bottom,var(--color-border-strong)_0_4px,transparent_4px_8px)]'
            "
        />
        <span
            class="pointer-events-none absolute -right-px top-1/2 h-[120%] w-px -translate-y-1/2 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]"
            :class="
                tier.highlight
                    ? 'bg-[repeating-linear-gradient(to_bottom,var(--color-amber-500)_0_4px,transparent_4px_8px)]'
                    : 'bg-[repeating-linear-gradient(to_bottom,var(--color-border-strong)_0_4px,transparent_4px_8px)]'
            "
        />

        <!-- header block (inner guides stay border-strong) -->
        <div class="relative mb-4">
            <span
                class="pointer-events-none absolute -top-px left-1/2 h-px w-[120%] -translate-x-1/2 bg-[repeating-linear-gradient(to_right,var(--color-border-strong)_0_4px,transparent_4px_8px)] [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
            />
            <span
                class="pointer-events-none absolute -bottom-px left-1/2 h-px w-[120%] -translate-x-1/2 bg-[repeating-linear-gradient(to_right,var(--color-border-strong)_0_4px,transparent_4px_8px)] [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
            />
            <div class="relative flex flex-col gap-y-2 p-6">
                <Badge
                    v-if="tier.highlight"
                    variant="success"
                    class="absolute top-4 right-4"
                >
                    Recommended
                </Badge>
                <h2 class="text-lg font-semibold">{{ tier.name }}</h2>
                <div class="mt-2 flex items-baseline gap-1">
                    <span
                        class="font-display text-5xl font-semibold sm:text-6xl"
                        >{{ tier.price }}</span
                    >
                    <span class="text-sm text-text-tertiary">{{
                        tier.period
                    }}</span>
                </div>
                <p class="text-sm">{{ tier.tagline }}</p>
            </div>
        </div>

        <!-- features (inner guide stays border-strong) -->
        <ul class="relative mb-6 flex-1 space-y-0 md:space-y-2.5">
            <li
                v-for="f in tier.features"
                :key="f"
                class="flex items-start gap-2 px-6 py-2 font-mono text-sm text-text-primary"
            >
                <PhCheck
                    class="mt-0.5 size-4 shrink-0 text-amber-500"
                    weight="bold"
                />
                {{ f }}
            </li>
            <span
                class="pointer-events-none absolute -bottom-px left-1/2 h-px w-[120%] -translate-x-1/2 bg-[repeating-linear-gradient(to_right,var(--color-border-strong)_0_4px,transparent_4px_8px)] [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
            />
        </ul>

        <!-- CTA (inner guides stay border-strong) -->
        <div class="relative p-4">
            <span
                class="pointer-events-none absolute -top-px left-1/2 h-px w-[120%] -translate-x-1/2 bg-[repeating-linear-gradient(to_right,var(--color-border-strong)_0_4px,transparent_4px_8px)] [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
            />
            <span
                class="pointer-events-none absolute -bottom-px left-1/2 h-px w-[120%] -translate-x-1/2 bg-[repeating-linear-gradient(to_right,var(--color-border-strong)_0_4px,transparent_4px_8px)] [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
            />
            <Button
                :variant="tier.highlight ? 'primary' : 'outline'"
                size="lg"
                class="w-full justify-center gap-2"
                @click="emit('cta', tier)"
            >
                <PhLightning
                    v-if="tier.highlight"
                    class="size-4 text-amber-500"
                    weight="fill"
                />
                {{ tier.cta }}
            </Button>
        </div>
    </div>
</template>
