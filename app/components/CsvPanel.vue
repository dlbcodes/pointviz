<!-- app/components/CsvPanel.vue -->
<script setup lang="ts">
import { computed, ref } from "vue";
import {
    Button,
    Field,
    FieldLabel,
    FieldContent,
    FieldDescription,
    FieldError,
    Textarea,
} from "@dlbcodes/ui";
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
        <Field :invalid="!!parsed.error">
            <FieldLabel>Paste CSV</FieldLabel>
            <FieldContent>
                <Textarea
                    v-model="raw"
                    :rows="8"
                    autosize
                    class="font-mono text-xs"
                    placeholder="country,domestic,external&#10;Japan,178.1,26.1&#10;Italy,90.0,48.9"
                />
                <FieldDescription>
                    First column = categories, other columns = series. Header
                    row required.
                </FieldDescription>
                <FieldError v-if="parsed.error">{{ parsed.error }}</FieldError>
            </FieldContent>
        </Field>

        <!-- Parse preview — the safety net before importing -->
        <div
            v-if="parsed.preview"
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
