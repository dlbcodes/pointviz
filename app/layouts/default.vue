<!-- app/layouts/default.vue -->
<script setup lang="ts">
import { Button } from "@dlbcodes/ui";

const user = useSupabaseUser();
const authModalOpen = useState("auth-modal-open", () => false);
const upgradeModalOpen = useState("upgrade-modal-open", () => false);
const feedbackModalOpen = useState("feedback-modal-open", () => false);
</script>

<template>
    <div
        class="flex h-screen w-screen flex-col overflow-hidden bg-bg-base text-text-primary font-sans"
    >
        <header
            class="flex h-14 shrink-0 items-center justify-between border-b border-border-default px-6"
        >
            <NuxtLink to="/" class="flex items-center gap-3">
                <div
                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-200 text-sm font-bold text-text-inverse"
                >
                    P
                </div>
                <h1 class="text-base font-semibold tracking-tight">PointViz</h1>
                <span
                    class="rounded-full bg-bg-subtle px-2 py-0.5 text-xs text-text-tertiary"
                    >v0.1</span
                >
            </NuxtLink>

            <div class="flex items-center gap-3">
                <ExportMenu />
                <UserMenu
                    v-if="user"
                    @open-feedback="feedbackModalOpen = true"
                />
                <Button
                    v-else
                    variant="primary"
                    size="sm"
                    @click="authModalOpen = true"
                    >Log in</Button
                >
            </div>
        </header>

        <slot />

        <AuthModal v-model:open="authModalOpen" />
        <UpgradeModal v-model:open="upgradeModalOpen" />
        <FeedbackModal v-model:open="feedbackModalOpen" />
    </div>
</template>
