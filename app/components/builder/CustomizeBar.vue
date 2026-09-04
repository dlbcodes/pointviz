<!-- app/components/CustomizeBar.vue -->
<script setup lang="ts">
import { ref } from "vue";
import {
    Panel,
    PanelHeader,
    PanelContent,
    Textarea,
    Button,
} from "@dlbcodes/ui";
import { PhArrowElbowDownLeft } from "@phosphor-icons/vue";

const { instruction, pending, customizeError, customize, canCustomize } =
    useCustomize();

const inputRef = ref();

// Curated to advertise BREADTH — color, layout, labels, theme — not just one axis.
const suggestions = [
    "Use a colorblind-safe palette",
    "Make it horizontal and sorted descending",
    "Show values inside the bars",
    "Apply the DataPoint theme",
    "Put the legend on top",
];

const focusInput = (e: MouseEvent): void => {
    if ((e.target as HTMLElement).closest("button, [role='menu'], a")) return;
    const el = inputRef.value?.$el ?? inputRef.value;
    el?.querySelector?.("textarea")?.focus() ?? el?.focus?.();
};

// Fill and focus — don't auto-send. Chips teach phrasing; the user still chooses to apply.
const useSuggestion = (text: string): void => {
    instruction.value = text;
    const el = inputRef.value?.$el ?? inputRef.value;
    el?.querySelector?.("textarea")?.focus() ?? el?.focus?.();
};

const submit = (): void => {
    if (!instruction.value.trim() || pending.value) return;
    customize();
};

const onKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit();
    }
};
</script>

<template>
    <div v-if="canCustomize" class="mx-auto w-full max-w-4xl space-y-1.5">
        <Panel class="overflow-visible">
            <PanelHeader
                class="flex flex-nowrap gap-1.5 overflow-x-auto pb-2 no-scrollbar"
            >
                <span class="text-sm text-text-secondary">Hints:</span>
                <button
                    v-for="s in suggestions"
                    :key="s"
                    type="button"
                    :disabled="pending"
                    class="cursor-pointer shrink-0 rounded-lg bg-bg-base border border-border-default px-2.5 py-1 text-xs text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary disabled:opacity-50"
                    @click="useSuggestion(s)"
                >
                    {{ s }}
                </button>
            </PanelHeader>

            <PanelContent
                class="cursor-text p-3 border border-border-subtle"
                @click="focusInput"
            >
                <div class="flex items-end gap-2">
                    <Textarea
                        ref="inputRef"
                        v-model="instruction"
                        autosize
                        :rows="1"
                        :disabled="pending"
                        placeholder="Describe a change — e.g. make it horizontal with a colorblind palette"
                        class="flex-1 border-0 bg-transparent shadow-none focus-within:ring-0"
                        @keydown="onKeydown"
                    />
                    <Button
                        size="icon"
                        class="shrink-0"
                        aria-label="Apply change"
                        :disabled="!instruction.trim() || pending"
                        @click="submit"
                    >
                        <PhArrowElbowDownLeft
                            class="size-5"
                            aria-hidden="true"
                        />
                    </Button>
                </div>
            </PanelContent>
        </Panel>

        <p v-if="customizeError" class="px-1 text-xs font-mono text-danger-500">
            {{ customizeError }}
        </p>
    </div>
</template>
