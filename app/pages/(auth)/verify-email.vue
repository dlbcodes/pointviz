<script setup lang="ts">
import { Panel, PanelContent } from "@dlbcodes/ui";
import { PhEnvelopeSimple } from "@phosphor-icons/vue";

definePageMeta({ layout: "auth", middleware: "guest" });

const route = useRoute();
const email = route.query.email as string | undefined;
</script>

<template>
    <Panel class="w-full max-w-md">
        <PanelContent class="flex flex-col items-center gap-5 p-8 text-center">
            <div
                class="flex size-12 items-center justify-center rounded-full bg-bg-subtle"
            >
                <PhEnvelopeSimple class="size-6 text-brand-200" />
            </div>
            <div>
                <div
                    class="text-2xl font-semibold tracking-tight text-text-primary"
                >
                    Check your email
                </div>
                <p class="mt-2 text-sm text-text-secondary">
                    We sent a confirmation link to
                    <span v-if="email" class="font-medium text-text-primary">{{
                        email
                    }}</span>
                    <span v-else>your inbox</span>. Click it to activate your
                    account.
                </p>
            </div>
            <p class="text-xs text-text-tertiary">
                Didn't get it? Check your spam folder, or
                <NuxtLink to="/signup" class="text-brand-200 hover:underline"
                    >try again</NuxtLink
                >.
            </p>
        </PanelContent>
    </Panel>
</template>
