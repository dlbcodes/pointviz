<!-- app/components/CustomizeBar.vue -->
<script setup lang="ts">
import { ref } from "vue";
import {
    Panel,
    PanelHeader,
    PanelContent,
    Textarea,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownContent,
    DropdownItem,
} from "@dlbcodes/ui";
import {
    PhArrowElbowDownLeft,
    PhSparkle,
    PhLightbulb,
} from "@phosphor-icons/vue";
import { STYLE_PRESETS, type StylePreset } from "~/lib/style-presets";

const { instruction, pending, customizeError, customize, canCustomize } =
    useCustomize();

const inputRef = ref();

// Curated to advertise BREADTH — color, layout, labels, theme — not just one axis.
const suggestions = [
    "Use a colorblind-safe palette",
    "Make it horizontal and sorted descending",
    "Show values inside the bars",
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

function applyPreset(preset: StylePreset) {
    instruction.value = preset.instruction;
    // auto-send the preset (it's a complete instruction, not a phrasing hint):
    customize();
}

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
                <span class="text-sm text-text-secondary"> Hints: </span>
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
                class="cursor-text p-3 border border-border-subtle overflow-visible"
                @click="focusInput"
            >
                <div class="flex items-end gap-2">
                    <!-- Style presets dropdown -->
                    <Dropdown placement="top-start">
                        <DropdownTrigger
                            v-slot="{ open }"
                            aria-label="Apply a preset style"
                            :disabled="pending"
                        >
                            <div
                                class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border-default transition-colors"
                                :class="
                                    open
                                        ? 'bg-bg-subtle text-text-primary'
                                        : 'hover:text-text-primary text-text-secondary '
                                "
                            >
                                <PhSparkle class="size-5" />
                            </div>
                        </DropdownTrigger>
                        <DropdownContent size="sm" class="p-1 no-scrollbar">
                            <div
                                class="px-2 py-1.5 text-xs font-medium text-text-tertiary"
                            >
                                Preset styles
                            </div>
                            <DropdownItem
                                v-for="preset in STYLE_PRESETS"
                                :key="preset.id"
                                class="flex items-center gap-3"
                                @click="applyPreset(preset)"
                            >
                                <!-- Dynamic Background -->
                                <div
                                    class="flex items-center justify-center size-8 rounded-lg shrink-0"
                                    :style="{ backgroundColor: preset.bgColor }"
                                >
                                    <div class="flex -space-x-1">
                                        <!-- Dynamic Colors -->
                                        <div
                                            v-for="(
                                                color, index
                                            ) in preset.colors.slice(0, 3)"
                                            :key="color"
                                            class="size-2.5 rounded-xs border border-white/10"
                                            :class="{
                                                '-rotate-8': index === 0,
                                                'rotate-8': index === 1,
                                                'rotate-12': index === 2,
                                            }"
                                            :style="{ backgroundColor: color }"
                                        />
                                    </div>
                                </div>

                                <!-- Text -->
                                <div class="flex flex-col items-start">
                                    <span
                                        class="text-sm font-medium text-text-primary"
                                    >
                                        {{ preset.name }}
                                    </span>
                                    <span class="text-xs text-text-tertiary">
                                        {{ preset.description }}
                                    </span>
                                </div>
                            </DropdownItem>
                        </DropdownContent>
                    </Dropdown>

                    <Textarea
                        ref="inputRef"
                        v-model="instruction"
                        autosize
                        :rows="1"
                        :disabled="pending"
                        placeholder="Describe a change — e.g. make it horizontal with a colorblind palette"
                        class="flex-1 border-0 bg-transparent shadow-none focus-within:ring-0 no-scrollbar"
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
