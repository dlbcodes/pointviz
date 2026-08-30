<!-- app/components/CsvPanel.vue -->
<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from "@dlbcodes/ui";
import { csvToSpec } from "~/composables/useCsvImport";

const { loadSpec } = useChartSpec();

const raw = ref("");
const parsed = computed(() => csvToSpec(raw.value));

function importCsv() {
    if (parsed.value.spec) {
        loadSpec(JSON.stringify(parsed.value.spec, null, 2));
    }
}
</script>

<template>
    <div class="space-y-3">
        <h3
            class="text-xs font-mono font-medium tracking-wider text-text-tertiary"
        >
            Paste CSV
        </h3>
        <p class="text-xs font-mono text-text-tertiary leading-relaxed">
            First column = categories, other columns = series. Header row
            required.
        </p>

        <textarea
            v-model="raw"
            class="w-full h-40 rounded-lg border border-border-default p-3 text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-chart-teal/20 focus:border-chart-teal resize-none"
            placeholder="country,domestic,external&#10;Japan,178.1,26.1&#10;Italy,90.0,48.9"
        ></textarea>

        <!-- Live parse feedback -->
        <p v-if="parsed.error" class="text-xs font-mono text-danger-500">
            {{ parsed.error }}
        </p>

        <div
            v-else-if="parsed.preview"
            class="rounded-lg border border-border-default p-3 text-xs font-mono text-text-secondary space-y-1"
        >
            <div>
                <span class="text-text-tertiary">Categories:</span>
                {{ parsed.preview.categories.length }}
                ({{ parsed.preview.categories.slice(0, 3).join(", ")
                }}<span v-if="parsed.preview.categories.length > 3">…</span>)
            </div>
            <div>
                <span class="text-text-tertiary">Series:</span>
                {{ parsed.preview.seriesNames.join(", ") }}
            </div>
        </div>

        <Button
            class="w-full"
            size="sm"
            :disabled="!parsed.spec"
            @click="importCsv"
        >
            Import chart
        </Button>
    </div>
</template>
