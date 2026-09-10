<!-- app/components/UpgradeModal.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { Modal, ModalContent, ModalClose, Button, Badge } from "@dlbcodes/ui";
import { PhCheck, PhSparkle } from "@phosphor-icons/vue";
import { PRICING_TIERS } from "~/lib/pricing";
import { billingApiService } from "~/services/BillingApiService";

const open = defineModel<boolean>("open", { required: true });

const upgrading = ref(false);
const error = ref<string | null>(null);

async function upgrade() {
    if (upgrading.value) return;
    upgrading.value = true;
    error.value = null;
    try {
        const url = await billingApiService.createCheckout();
        window.location.href = url; // redirect to Stripe checkout
    } catch (e) {
        error.value = (e as Error).message ?? "Couldn't start checkout.";
        upgrading.value = false; // reset on error (success navigates away)
    }
}
</script>

<template>
    <Modal v-model="open" size="2xl">
        <ModalContent class="p-8">
            <ModalClose />

            <div class="mb-8 flex flex-col items-center text-center">
                <div
                    class="mb-3 flex size-14 items-center justify-center rounded-full bg-linear-to-r from-gray-700 via-gray-900 to-black"
                >
                    <PhSparkle class="size-8 text-amber-400" weight="fill" />
                </div>
                <h2 class="text-xl font-semibold tracking-tight">
                    Unlock unlimited AI
                </h2>
                <p class="mt-1 max-w-sm text-sm text-text-secondary">
                    You've hit your monthly limit. Upgrade to Pro for unlimited
                    customizations and badge-free exports.
                </p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
                <div
                    v-for="tier in PRICING_TIERS"
                    :key="tier.id"
                    class="relative flex flex-col rounded-xl border p-5"
                    :class="
                        tier.highlight
                            ? 'border-brand-200 bg-bg-surface'
                            : 'border-border-default'
                    "
                >
                    <Badge
                        v-if="tier.id === 'FREE'"
                        class="absolute right-4 top-4"
                        >Current</Badge
                    >

                    <h3 class="text-sm font-semibold text-text-primary">
                        {{ tier.name }}
                    </h3>
                    <div class="mt-1 flex items-baseline gap-1">
                        <span class="text-2xl font-semibold">{{
                            tier.price
                        }}</span>
                        <span class="text-xs text-text-tertiary">{{
                            tier.period
                        }}</span>
                    </div>

                    <ul class="mt-4 flex-1 space-y-2">
                        <li
                            v-for="f in tier.features"
                            :key="f"
                            class="flex items-start gap-2 text-xs"
                            :class="
                                tier.highlight
                                    ? 'text-text-secondary'
                                    : 'text-text-tertiary'
                            "
                        >
                            <PhCheck
                                class="mt-0.5 size-3.5 shrink-0"
                                :class="
                                    tier.highlight
                                        ? 'text-chart-teal'
                                        : 'text-text-tertiary'
                                "
                            />
                            {{ f }}
                        </li>
                    </ul>

                    <!-- Pro: real checkout. Free: inert (current plan). -->
                    <Button
                        v-if="tier.highlight"
                        class="mt-5 w-full"
                        :disabled="upgrading"
                        @click="upgrade"
                    >
                        {{ upgrading ? "Redirecting…" : "Upgrade to Pro" }}
                    </Button>
                    <Button
                        v-else
                        variant="outline"
                        class="mt-5 w-full"
                        disabled
                    >
                        Your current plan
                    </Button>
                </div>
            </div>

            <p v-if="error" class="mt-4 text-center text-xs text-danger-500">
                {{ error }}
            </p>
        </ModalContent>
    </Modal>
</template>
