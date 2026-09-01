<!-- layouts/default.vue -->
<script setup lang="ts">
import { Button } from "@dlbcodes/ui";

const { title, isValid } = useChartSpec();
const user = useSupabaseUser();

const authModalOpen = useState("auth-modal-open", () => false);
const feedbackModalOpen = useState("feedback-modal-open", () => false);
const helpModalOpen = useState("help-modal-open", () => false);
const shortcutsModalOpen = useState("shortcuts-modal-open", () => false);
const upgradeModalOpen = useState("upgrade-modal-open", () => false);
</script>

<template>
    <div
        class="flex h-screen w-screen flex-col overflow-hidden bg-bg-base text-text-primary font-sans"
    >
        <header
            class="flex h-14 shrink-0 items-center justify-between border-b border-border-default px-6"
        >
            <!-- Brand -->
            <div class="flex items-center gap-3">
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
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3">
                <ExportMenu />
                <UserMenu
                    v-if="user"
                    @open-feedback="feedbackModalOpen = true"
                    @open-help="helpModalOpen = true"
                    @open-shortcuts="shortcutsModalOpen = true"
                />
                <Button
                    v-else
                    variant="primary"
                    size="sm"
                    @click="authModalOpen = true"
                >
                    Log in
                </Button>
            </div>
        </header>

        <slot />

        <!-- Global modals -->
        <AuthModal v-model:open="authModalOpen" />
        <FeedbackModal v-model:open="feedbackModalOpen" />
        <HelpModal v-model:open="helpModalOpen" />
        <ShortcutsModal v-model:open="shortcutsModalOpen" />
        <UpgradeModal v-model:open="upgradeModalOpen" />
    </div>
</template>
