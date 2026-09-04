<!-- app/layouts/builder.vue -->
<script setup lang="ts">
import { Button } from "@dlbcodes/ui";
import { PhCornersOut, PhList } from "@phosphor-icons/vue";

const { toggle } = useFullscreen();

const exportPanelOpen = useState("export-panel-open", () => false);
</script>

<template>
    <div
        class="flex h-screen w-screen flex-col overflow-hidden bg-bg-base text-text-primary font-sans"
    >
        <header
            class="flex h-14 shrink-0 items-center justify-between border-b border-border-default px-6"
        >
            <!-- Left: brand + back to library -->
            <div class="flex items-center gap-4">
                <NuxtLink to="/charts">
                    <BrandMark />
                </NuxtLink>
            </div>

            <!-- Right: tool actions -->
            <div class="flex items-center gap-3">
                <SaveIndicator />

                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Fullscreen"
                    @click="toggle"
                >
                    <PhCornersOut class="size-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Export & share"
                    @click="exportPanelOpen = !exportPanelOpen"
                >
                    <PhList class="size-4" />
                </Button>
            </div>
        </header>

        <slot />

        <AppModals />
    </div>
</template>
