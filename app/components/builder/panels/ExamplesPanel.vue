<!-- app/components/ExamplesPanel.vue -->
<script setup lang="ts">
import { examples } from "~/lib/examples";

const { rawInput } = useChartSpec();
const emit = defineEmits<{ loaded: [] }>();

function loadExample(json: string) {
    rawInput.value = json;
    emit("loaded"); // let the parent switch to the JSON tab
}
</script>

<template>
    <div class="space-y-3">
        <h3
            class="mb-4 text-xs font-mono font-medium tracking-wider text-text-tertiary"
        >
            Choose a Template
        </h3>
        <div
            v-for="(example, index) in examples"
            :key="index"
            @click="loadExample(example.json)"
            class="group cursor-pointer rounded-lg border border-border-default p-4 transition-all hover:border-border-strong hover:bg-bg-base"
        >
            <h4
                class="text-xs uppercase font-mono tracking-[-0.0125em] font-medium text-text-primary group-hover:text-chart-teal transition-colors"
            >
                {{ example.name }}
            </h4>
            <p
                class="mt-1 text-xs font-mono text-text-tertiary leading-relaxed"
            >
                {{ example.description }}
            </p>
            <div
                class="mt-3 flex items-center text-xs font-medium text-chart-teal opacity-0 transition-opacity group-hover:opacity-100"
            >
                Load this example &rarr;
            </div>
        </div>
    </div>
</template>
