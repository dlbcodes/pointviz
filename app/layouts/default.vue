<!-- app/layouts/default.vue -->
<script setup lang="ts">
import { Button } from "@dlbcodes/ui";
import { PhDownloadSimple } from "@phosphor-icons/vue";

const user = useSupabaseUser();

// Only the flags THIS layout's header triggers.
const authModalOpen = useState("auth-modal-open", () => false);
const exportPanelOpen = useState("export-panel-open", () => false);

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

                <nav v-if="!user" class="hidden items-center gap-4 md:flex">
                    <NuxtLink
                        v-for="link in marketingLinks"
                        :key="link.to"
                        :to="link.to"
                        class="font-mono text-xs tracking-tight text-text-secondary transition-colors hover:text-text-primary"
                    >
                        {{ link.label }}
                    </NuxtLink>
                </nav>
            </div>

            <!-- Right: tool actions + auth -->
            <div class="flex items-center gap-3">
                <SaveIndicator />

                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Export & share"
                    @click="exportPanelOpen = !exportPanelOpen"
                >
                    <PhDownloadSimple class="size-4" />
                </Button>

                <template v-if="!user">
                    <SaveButton />

                    <NuxtLink to="/login">
                        <Button variant="ghost" size="sm">Log in</Button>
                    </NuxtLink>
                    <Button
                        variant="primary"
                        size="sm"
                        @click="authModalOpen = true"
                        >Sign up</Button
                    >
                </template>
            </div>
        </header>

        <slot />

        <!-- All global modals, mounted once -->
        <AppModals />
    </div>
</template>
