<!-- app/components/SaveIndicator.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { PhCloudCheck, PhCloudArrowUp } from "@phosphor-icons/vue";

const chartStore = useChartStore();

// Only meaningful for a saved chart (has an id). Otherwise render nothing.
const state = computed<"saving" | "saved" | null>(() => {
    if (!chartStore.currentChartId) return null; // unsaved draft / anonymous
    if (chartStore.saving) return "saving";
    if (chartStore.lastSavedAt) return "saved";
    return "saved"; // opened but not yet re-saved — it's in the DB, so "saved"
});
</script>

<template>
    <div
        v-if="state"
        class="flex items-center gap-1.5 text-xs text-text-tertiary"
    >
        <template v-if="state === 'saving'">
            <PhCloudArrowUp class="size-4 animate-pulse" />
            <span>Saving…</span>
        </template>
        <template v-else>
            <PhCloudCheck class="size-4" />
            <span>Saved</span>
        </template>
    </div>
</template>
