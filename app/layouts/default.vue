<!-- app/layouts/default.vue — header section -->
<script setup lang="ts">
import { Button } from "@dlbcodes/ui";
import { PhDownloadSimple } from "@phosphor-icons/vue";

const user = useSupabaseUser();
const authModalOpen = useState("auth-modal-open", () => false);
const upgradeModalOpen = useState("upgrade-modal-open", () => false);
const feedbackModalOpen = useState("feedback-modal-open", () => false);
const helpModalOpen = useState("help-modal-open", () => false);
const shortcutsModalOpen = useState("shortcuts-modal-open", () => false);
const exportPanelOpen = useState("export-panel-open", () => true);

const marketingLinks = [
    { label: "How it works", to: "/how-it-works" },
    { label: "Pricing", to: "/pricing" },
];
</script>

<template>
    <div
        class="flex h-screen w-screen flex-col overflow-hidden bg-bg-base text-text-primary font-sans"
    >
        <header
            class="flex h-14 shrink-0 items-center justify-between border-b border-border-default px-6"
        >
            <!-- Left: brand + (logged-out only) marketing nav -->
            <div class="flex items-center gap-6">
                <NuxtLink to="/" class="flex items-center gap-2">
                    <div
                        class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-200 text-sm font-bold text-text-inverse"
                    >
                        P
                    </div>
                    <span class="text-base font-semibold tracking-tight"
                        >PointViz</span
                    >
                </NuxtLink>

                <!-- Marketing nav — only for logged-out visitors -->
                <nav v-if="!user" class="hidden items-center gap-4 md:flex">
                    <NuxtLink
                        v-for="link in marketingLinks"
                        :key="link.to"
                        :to="link.to"
                        class="font-mono tracking-tight text-xs text-text-primary transition-colors hover:text-text-primary"
                    >
                        {{ link.label }}
                    </NuxtLink>
                </nav>
            </div>

            <!-- Right: tool actions + auth -->
            <div class="flex items-center gap-3">
                <!-- <ExportMenu /> -->
                <SaveButton />

                <template v-if="user">
                    <UserMenu
                        @open-feedback="feedbackModalOpen = true"
                        @open-help="helpModalOpen = true"
                        @open-shortcuts="shortcutsModalOpen = true"
                    />
                </template>
                <template v-else>
                    <NuxtLink to="/login">
                        <Button variant="ghost" size="sm">Log in</Button>
                    </NuxtLink>
                    <Button
                        variant="primary"
                        size="sm"
                        @click="authModalOpen = true"
                    >
                        Sign up
                    </Button>
                </template>
                <Button
                    variant="icon"
                    size="icon"
                    @click="exportPanelOpen = !exportPanelOpen"
                >
                    <PhDownloadSimple class="size-4" />
                </Button>
            </div>
        </header>

        <slot />

        <AuthModal v-model:open="authModalOpen" />
        <UpgradeModal v-model:open="upgradeModalOpen" />
        <FeedbackModal v-model:open="feedbackModalOpen" />
        <HelpModal v-model:open="helpModalOpen" />
        <ShortcutsModal v-model:open="shortcutsModalOpen" />
    </div>
</template>
