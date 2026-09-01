<!-- app/components/SaveButton.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import { Button } from "@dlbcodes/ui";
import { PhFloppyDisk, PhCheck } from "@phosphor-icons/vue";

const { isValid } = useChartSpec();
const chartStore = useChartStore();
const user = useSupabaseUser();
const authModalOpen = useState("auth-modal-open", () => false);

const saving = ref(false);
const justSaved = ref(false);

const isSaved = computed(() => chartStore.currentChartId !== null);

async function save() {
    // Saving requires an account (a chart needs an owner).
    if (!user.value) {
        authModalOpen.value = true;
        return;
    }
    if (!isValid.value || saving.value) return;

    saving.value = true;
    try {
        const chart = await chartStore.saveCurrent();
        // If this was a first save, put the id in the URL so refresh/return works.
        if (chart && !isSaved.value) {
            // navigate to the chart's own route without a full reload
            history.replaceState(null, "", `/charts/${chart.id}`);
        }
        justSaved.value = true;
        setTimeout(() => (justSaved.value = false), 1500);
    } finally {
        saving.value = false;
    }
}
</script>

<template>
    <Button
        variant="outline"
        size="sm"
        :disabled="!isValid || saving"
        @click="save"
    >
        <component :is="justSaved ? PhCheck : PhFloppyDisk" class="size-4" />
        {{
            saving
                ? "Saving…"
                : justSaved
                  ? "Saved"
                  : isSaved
                    ? "Save"
                    : "Save chart"
        }}
    </Button>
</template>
