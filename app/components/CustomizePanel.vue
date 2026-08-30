<!-- app/components/CustomizePanel.vue -->
<script setup lang="ts">
import { Button } from "@dlbcodes/ui";

const { instruction, pending, customizeError, customize, canCustomize } =
    useCustomize();
</script>

<template>
    <div class="space-y-3">
        <h3
            class="text-xs font-mono font-medium tracking-wider text-text-tertiary"
        >
            Customize the chart
        </h3>

        <p
            v-if="!canCustomize"
            class="text-xs font-mono text-text-tertiary leading-relaxed"
        >
            Load a valid chart first — pick an example or paste a spec under
            Custom JSON.
        </p>

        <template v-else>
            <textarea
                v-model="instruction"
                :disabled="pending"
                class="w-full h-28 rounded-lg border border-border-default p-3 text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-chart-teal/20 focus:border-chart-teal resize-none disabled:opacity-60"
                placeholder="e.g. Make it horizontal and stacked, sort descending, and emphasize Sweden"
                @keydown.meta.enter="customize"
            ></textarea>
            <Button
                class="w-full"
                size="sm"
                :disabled="pending || !instruction.trim()"
                @click="customize"
            >
                {{ pending ? "Applying…" : "Apply change" }}
            </Button>
            <p v-if="customizeError" class="text-xs font-mono text-danger-500">
                {{ customizeError }}
            </p>
        </template>
    </div>
</template>
