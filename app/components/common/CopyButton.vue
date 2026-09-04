<!-- app/components/CopyButton.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dlbcodes/ui";
import { PhCheck, PhCopy } from "@phosphor-icons/vue";
import type { Component } from "vue";

const props = withDefaults(
    defineProps<{
        text: string;
        icon?: Component; // default icon when not copied (falls back to PhCopy)
        label?: string; // optional text label; icon-only if omitted
    }>(),
    { icon: undefined, label: undefined },
);

const copied = ref(false);

async function copy() {
    if (!props.text) return;
    try {
        await navigator.clipboard.writeText(props.text);
        copied.value = true;
        setTimeout(() => (copied.value = false), 1500);
    } catch {
        /* clipboard blocked — silently no-op */
    }
}
</script>

<template>
    <Button variant="outline" size="sm" @click="copy">
        <component :is="copied ? PhCheck : (icon ?? PhCopy)" class="size-4" />
        <span v-if="label">{{ copied ? "Copied" : label }}</span>
    </Button>
</template>
