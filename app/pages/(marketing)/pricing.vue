<!-- app/pages/pricing.vue -->
<script setup lang="ts">
import { Disclosure, DisclosureTrigger, DisclosureContent } from "@dlbcodes/ui";
import { PRICING_TIERS, type PricingTier } from "~/lib/pricing";
import { PRICING_FAQS } from "~/config/faqs";

definePageMeta({ layout: "default" });
useSeoMeta({
    title: "Simple, Transparent Pricing",
    description:
        "Start building beautiful, interactive charts for free. Upgrade to PointViz Pro for unlimited AI prompts, private charts, and custom branding. No hidden fees.",

    // Open Graph
    ogTitle: "Simple, Transparent Pricing | PointViz",
    ogDescription:
        "Start building beautiful, interactive charts for free. Upgrade to PointViz Pro for unlimited AI prompts, private charts, and custom branding.",
    ogUrl: "https://www.pointviz.co/pricing",

    // Twitter
    twitterTitle: "Simple, Transparent Pricing | PointViz",
    twitterDescription:
        "Start building beautiful, interactive charts for free. Upgrade to PointViz Pro for unlimited AI prompts, private charts, and custom branding.",
});

// Add canonical link specifically for this page
useHead({
    link: [{ rel: "canonical", href: "https://www.pointviz.co/pricing" }],
});

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
        <div class="gap-y-4 mb-18 text-center">
            <GuideFrame color="subtle">
                <h1
                    class="font-display text-4xl font-semibold tracking-tight sm:text-5xl"
                >
                    Simple pricing
                </h1>
            </GuideFrame>
            <p class="mt-6 text-lg text-text-secondary">
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

        <p class="mt-18 text-center text-xs text-text-tertiary">
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
