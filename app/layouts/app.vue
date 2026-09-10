<!-- app/layouts/app.vue -->
<script setup lang="ts">
import { Button } from "@dlbcodes/ui";
import { PhLightning } from "@phosphor-icons/vue";

const userStore = useUserStore();
const feedbackModalOpen = useState("feedback-modal-open", () => false);
const helpModalOpen = useState("help-modal-open", () => false);
const shortcutsModalOpen = useState("shortcuts-modal-open", () => false);
const upgradeModalOpen = useState("upgrade-modal-open", () => false);
</script>

<template>
    <div
        class="flex h-screen flex-col overflow-hidden pt-4 pb-4 px-4 md:pb-8 md:px-8 bg-bg-surface/40 bg-size-[20px_20px] bg-[radial-gradient(circle,rgba(0,0,0,0.1)_1px,transparent_1px)]"
    >
        <!-- Header: fixed, doesn't grow -->
        <div class="flex shrink-0 items-center justify-between px-4 pb-4">
            <NuxtLink to="/charts">
                <BrandMark />
            </NuxtLink>
            <div class="flex items-center gap-x-4">
                <Button
                    v-if="!userStore.isPro"
                    size="sm"
                    @click="upgradeModalOpen = true"
                >
                    <PhLightning class="text-amber-400" weight="fill" />
                    Upgrade
                </Button>
                <UserMenu
                    variant="avatar"
                    @open-feedback="feedbackModalOpen = true"
                    @open-help="helpModalOpen = true"
                    @open-shortcuts="shortcutsModalOpen = true"
                />
            </div>
        </div>

        <!-- Main: fills remaining space, scrolls internally -->
        <main
            class="min-h-0 flex-1 overflow-y-auto rounded-3xl border border-border-default bg-bg-base p-8"
        >
            <slot />
        </main>
    </div>

    <AppModals />
</template>
