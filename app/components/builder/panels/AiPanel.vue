<!-- app/components/AiPanel.vue -->
<script setup lang="ts">
import {
    Field,
    FieldLabel,
    FieldContent,
    Textarea,
    Button,
} from "@dlbcodes/ui";
import { PhSparkle, PhCopy, PhCheck } from "@phosphor-icons/vue";

const { rawData, pending, importError, copied, copyPrompt, aiImport } =
    useDataImport();

// After a successful AI import, jump to the JSON tab to show the result.
const emit = defineEmits<{ loaded: [] }>();

async function convert() {
    await aiImport();
    // aiImport writes to rawInput via loadSpec on success; switch to JSON to reveal it
    if (!importError.value) emit("loaded");
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <Field>
            <FieldLabel class="flex items-center gap-1.5">
                <PhSparkle class="size-4 text-chart-teal" weight="fill" />
                Import with AI
            </FieldLabel>
            <FieldContent>
                <Textarea
                    v-model="rawData"
                    :rows="16"
                    autosize
                    :disabled="pending"
                    class="font-mono text-xs"
                    placeholder="Paste raw data — CSV, a spreadsheet range, or messy numbers. AI turns it into a chart."
                />
            </FieldContent>
        </Field>

        <div class="flex items-center gap-2">
            <Button
                class="flex-1"
                size="sm"
                :disabled="!rawData.trim() || pending"
                @click="convert"
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

        <p v-if="importError" class="font-mono text-xs text-danger-500">
            {{ importError }}
        </p>
        <p v-else class="text-xs leading-relaxed text-text-tertiary">
            No account? Copy the prompt, paste it into your own Claude or
            ChatGPT with your data, and paste the JSON it returns in the JSON
            tab.
        </p>
    </div>
</template>
