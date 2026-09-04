<!-- app/layouts/app.vue -->
<script setup lang="ts">
import { Button } from "@dlbcodes/ui";

const user = useSupabaseUser();
const feedbackModalOpen = useState("feedback-modal-open", () => false);
const helpModalOpen = useState("help-modal-open", () => false);
const shortcutsModalOpen = useState("shortcuts-modal-open", () => false);
</script>

<template>
    <div
        class="h-screen pt-4 pb-8 px-8 bg-bg-surface/40 bg-size-[20px_20px] bg-[radial-gradient(circle,rgba(0,0,0,0.05)_1px,transparent_1px)]"
    >
        <div class="flex justify-between items-center px-4 pb-4">
            <NuxtLink to="/charts">
                <BrandMark />
            </NuxtLink>
            <div class="flex items-center gap-x-4">
                <Button size="sm">Upgrade</Button>
                <UserMenu
                    variant="avatar"
                    @open-feedback="feedbackModalOpen = true"
                    @open-help="helpModalOpen = true"
                    @open-shortcuts="shortcutsModalOpen = true"
                />
            </div>
        </div>
        <main
            class="bg-bg-base rounded-3xl h-full overflow-y-auto p-8 border border-border-default"
        >
            <slot />
        </main>
    </div>

    <AppModals />
</template>
