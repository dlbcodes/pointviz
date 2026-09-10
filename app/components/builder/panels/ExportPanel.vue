<!-- app/components/ExportPanel.vue -->
<script setup lang="ts">
import { Button } from "@dlbcodes/ui";
import { PhX, PhDotsSixVertical } from "@phosphor-icons/vue";
import { useResizable } from "~/composables/useResizable";

const emit = defineEmits<{ close: [] }>();

const userStore = useUserStore();
const isDesktop = useMediaQuery("(min-width: 1024px)");
const { width, dragging, startResize } = useResizable({
    min: 300,
    max: 400,
    initial: 320,
    key: "pointviz:export-width",
    side: "right",
});
</script>

<template>
    <aside
        class="flex flex-col border-l border-border-default bg-bg-base max-lg:absolute max-lg:top-0 max-lg:right-0 max-lg:bottom-0 max-lg:z-40 max-lg:w-72 max-lg:shadow-xl lg:relative lg:shrink-0"
        :class="dragging ? 'border-brand-100' : ''"
        :style="{ width: isDesktop ? `${width}px` : undefined }"
    >
        <!-- Resize handle (desktop only) -->
        <div
            class="group absolute top-0 -left-1.5 z-10 hidden h-full w-3 cursor-col-resize items-center justify-center select-none md:flex"
            @pointerdown.prevent="startResize"
        >
            <div
                class="flex h-8 w-3 items-center justify-center rounded-full border border-border-default bg-bg-base text-text-tertiary transition-colors hover:border-brand-100 hover:text-brand-100"
                :class="dragging ? 'border-brand-100 text-brand-100' : ''"
            >
                <PhDotsSixVertical class="size-3" />
            </div>
        </div>

        <!-- Header -->
        <div
            class="flex h-14 shrink-0 items-center justify-between border-b border-border-default px-5"
        >
            <span class="text-sm font-medium">Export & Share</span>
            <Button
                variant="ghost"
                size="icon"
                aria-label="Close"
                @click="emit('close')"
            >
                <PhX class="size-4" />
            </Button>
        </div>

        <div class="flex-1 space-y-6 overflow-y-auto p-5">
            <ImageExport />
            <ShareControls />
        </div>

        <footer
            v-if="!userStore.isPro"
            class="shrink-0 border-t border-border-default px-6 py-4"
        >
            <UpgradeCta />
        </footer>
    </aside>
</template>
