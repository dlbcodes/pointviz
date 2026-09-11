<!-- app/components/JsonPanel.vue -->
<script setup lang="ts">
import { computed } from "vue";
import {
    Field,
    FieldLabel,
    FieldContent,
    FieldDescription,
    FieldError,
    Textarea,
    Button,
} from "@dlbcodes/ui";
import { PhBracketsCurly } from "@phosphor-icons/vue";

const { rawInput, error } = useChartSpec();

const canFormat = computed(
    () => rawInput.value.trim().length > 0 && !error.value,
);

function format() {
    if (!canFormat.value) return;
    try {
        rawInput.value = JSON.stringify(JSON.parse(rawInput.value), null, 2);
    } catch {
        /* guarded by canFormat */
    }
}
</script>

<template>
    <Field :invalid="!!error">
        <div class="flex items-center justify-between">
            <FieldLabel>Data Source (JSON)</FieldLabel>
            <Tooltip text="Format">
                <Button
                    variant="ghost"
                    size="icon"
                    :disabled="!canFormat"
                    aria-label="Format JSON"
                    @click="format"
                >
                    <PhBracketsCurly class="size-4" />
                </Button>
            </Tooltip>
        </div>
        <FieldContent>
            <Textarea
                v-model="rawInput"
                :rows="16"
                autosize
                class="font-mono text-xs"
                placeholder="Paste your PointViz JSON here…"
            />
            <FieldDescription>
                Columnar spec: categories plus one or more series.
            </FieldDescription>
            <FieldError v-if="error">{{ error }}</FieldError>
        </FieldContent>
    </Field>
</template>
