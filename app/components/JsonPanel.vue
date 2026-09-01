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
import {
    PhBracketsCurly,
    PhSparkle,
    PhCopy,
    PhCheck,
} from "@phosphor-icons/vue";

const { rawInput, error } = useChartSpec();
const { rawData, pending, importError, copied, copyPrompt, aiImport } =
    useDataImport();

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
    <div class="flex flex-col gap-5">
        <!-- ── AI import (metered) + copy-prompt (free) ── -->
        <div class="flex flex-col gap-2">
            <div class="flex items-center gap-1.5">
                <PhSparkle class="size-4 text-chart-teal" weight="fill" />
                <span class="text-sm font-medium text-text-primary"
                    >Import with AI</span
                >
            </div>

            <Textarea
                v-model="rawData"
                :rows="5"
                :disabled="pending"
                class="font-mono text-xs"
                placeholder="Paste raw data — CSV, a spreadsheet range, or messy numbers. AI turns it into a chart."
            />

            <div class="flex items-center gap-2">
                <Button
                    class="flex-1"
                    size="sm"
                    :disabled="!rawData.trim() || pending"
                    @click="aiImport"
                >
                    {{ pending ? "Converting…" : "Convert with AI" }}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    aria-label="Copy prompt for your own Claude"
                    @click="copyPrompt"
                >
                    <component :is="copied ? PhCheck : PhCopy" class="size-4" />
                    {{ copied ? "Copied" : "Copy prompt" }}
                </Button>
            </div>

            <p v-if="importError" class="text-xs font-mono text-danger-500">
                {{ importError }}
            </p>
            <p v-else class="text-xs text-text-tertiary leading-relaxed">
                No account? Copy the prompt, paste it into your own Claude or
                ChatGPT with your data, and paste the JSON it returns below.
            </p>
        </div>

        <!-- divider -->
        <div class="flex items-center gap-3">
            <span class="h-px flex-1 bg-border-default" />
            <span class="font-mono text-xs text-text-tertiary"
                >or paste a spec</span
            >
            <span class="h-px flex-1 bg-border-default" />
        </div>

        <!-- ── Manual JSON ── -->
        <Field :invalid="!!error">
            <div class="flex items-center justify-between">
                <FieldLabel>Data Source (JSON)</FieldLabel>
                <Button
                    variant="ghost"
                    size="sm"
                    :disabled="!canFormat"
                    aria-label="Format JSON"
                    @click="format"
                >
                    <PhBracketsCurly class="size-4" />
                    Format
                </Button>
            </div>
            <FieldContent>
                <Textarea
                    v-model="rawInput"
                    :rows="14"
                    class="font-mono text-xs"
                    placeholder="Paste your PointViz JSON here…"
                />
                <FieldDescription>
                    Columnar spec: categories plus one or more series.
                </FieldDescription>
                <FieldError v-if="error">{{ error }}</FieldError>
            </FieldContent>
        </Field>
    </div>
</template>
