<!-- app/pages/pricing.vue -->
<script setup lang="ts">
import { Disclosure, DisclosureTrigger, DisclosureContent } from "@dlbcodes/ui";
import { PRICING_TIERS, type PricingTier } from "~/lib/pricing";
import { PRICING_FAQS } from "~/config/faqs";

definePageMeta({ layout: "default" });

const user = useSupabaseUser();
const authModalOpen = useState("auth-modal-open", () => false);
const upgradeModalOpen = useState("upgrade-modal-open", () => false);

function onCta(tier: PricingTier) {
    if (tier.id === "FREE") {
        if (!user.value) authModalOpen.value = true;
        else navigateTo("/");
    } else {
        if (!user.value) authModalOpen.value = true;
        else upgradeModalOpen.value = true;
    }
}
</script>

<template>
    <div class="mx-auto max-w-3xl px-6 py-16 sm:py-24">
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
                    Simple pricing
                </h1>
            </div>
            <p class="mt-3 text-lg text-text-secondary">
                Start free. Upgrade when you need unlimited AI.
            </p>
        </div>

        <div class="grid gap-12 sm:grid-cols-2">
            <PricingCard
                v-for="tier in PRICING_TIERS"
                :key="tier.id"
                :tier="tier"
                @cta="onCta"
            />
        </div>

        <p class="mt-10 text-center text-xs text-text-tertiary">
            Questions?
            <a href="mailto:hello@pointviz.co" class="text-chart-teal"
                >Get in touch</a
            >.
        </p>
    </div>

    <!-- FAQ -->
    <div class="mx-auto max-w-6xl px-6 pb-24">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-[325px_1fr] md:gap-22">
            <div>
                <h2 class="font-display text-4xl font-semibold tracking-tight">
                    Questions and answers
                </h2>
            </div>
            <div class="flex flex-col gap-y-4">
                <Disclosure
                    v-for="faq in PRICING_FAQS"
                    :key="faq.q"
                    class="border-none"
                >
                    <DisclosureTrigger
                        class="font-display text-xl [&_svg]:fill-bg-inverse cursor-pointer hover:text-text-primary"
                    >
                        {{ faq.q }}
                    </DisclosureTrigger>
                    <DisclosureContent class="font-mono text-sm tracking-tight">
                        {{ faq.a }}
                    </DisclosureContent>
                </Disclosure>
            </div>
        </div>
    </div>

    <Cta />
</template>
