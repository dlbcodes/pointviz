<!-- app/pages/pricing.vue -->
<script setup lang="ts">
import { Button } from "@dlbcodes/ui";
import { PhCheck } from "@phosphor-icons/vue";
import { PLANS } from "~~/shared/plans";
import { PRICING_TIERS } from "~/lib/pricing";

definePageMeta({ layout: "default" }); // or "default" for now

const user = useSupabaseUser();
const authModalOpen = useState("auth-modal-open", () => false);
const upgradeModalOpen = useState("upgrade-modal-open", () => false);

const freeLimit = PLANS.FREE.customizeLimit;

const tiers = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        features: [
            `${freeLimit} AI customizations / month`,
            "Unlimited manual charts",
            "Save & organize your charts",
            "Public share links & embeds",
            "PNG export",
        ],
        cta: "Get started",
        highlight: false,
    },
    {
        name: "Pro",
        price: "$12",
        period: "/ month",
        features: [
            "Unlimited AI customizations",
            "No PointViz badge on exports & embeds",
            "Everything in Free",
            "Priority support",
        ],
        cta: "Upgrade to Pro",
        highlight: true,
    },
];

function onCta(tier: (typeof tiers)[number]) {
    if (tier.name === "Free") {
        if (!user.value) authModalOpen.value = true;
        else navigateTo("/");
    } else {
        if (!user.value) authModalOpen.value = true;
        else upgradeModalOpen.value = true;
    }
}
</script>

<template>
    <div class="mx-auto max-w-3xl px-6 py-16">
        <div class="mb-12 text-center">
            <h1 class="text-3xl font-semibold tracking-tight">
                Simple pricing
            </h1>
            <p class="mt-2 text-text-secondary">
                Start free. Upgrade when you need unlimited AI.
            </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
            <div
                v-for="tier in PRICING_TIERS"
                :key="tier.name"
                class="flex flex-col rounded-2xl border p-6"
                :class="
                    tier.highlight
                        ? 'border-brand-200 bg-bg-surface'
                        : 'border-border-default'
                "
            >
                <div class="mb-4">
                    <h2 class="text-lg font-semibold">{{ tier.name }}</h2>
                    <div class="mt-2 flex items-baseline gap-1">
                        <span class="text-3xl font-semibold">{{
                            tier.price
                        }}</span>
                        <span class="text-sm text-text-tertiary">{{
                            tier.period
                        }}</span>
                    </div>
                </div>

                <ul class="mb-6 flex-1 space-y-2.5">
                    <li
                        v-for="f in tier.features"
                        :key="f"
                        class="flex items-start gap-2 text-sm text-text-secondary"
                    >
                        <PhCheck
                            class="mt-0.5 size-4 shrink-0 text-chart-teal"
                        />
                        {{ f }}
                    </li>
                </ul>

                <Button
                    :variant="tier.highlight ? 'primary' : 'outline'"
                    class="w-full"
                    @click="onCta(tier)"
                >
                    {{ tier.cta }}
                </Button>
            </div>
        </div>

        <p class="mt-8 text-center text-xs text-text-tertiary">
            Questions?
            <a href="mailto:hello@pointviz.co" class="text-chart-teal"
                >Get in touch</a
            >.
        </p>
    </div>
</template>
