<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        size?: "2xs" | "xs" | "sm" | "base" | "lg";
        showName?: boolean;
    }>(),
    {
        size: "base",
        showName: true,
    },
);

const sizeMap = {
    "2xs": 14,
    xs: 18,
    sm: 24,
    base: 32,
    lg: 40,
} as const;

const size = computed(() => sizeMap[props.size]);

const width = computed(() =>
    props.showName ? Math.round(size.value * (114 / 32)) : size.value,
);

const viewBox = computed(() => (props.showName ? "0 0 114 32" : "0 0 32 32"));
</script>

<template>
    <div class="flex items-center gap-2">
        <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-200 text-sm font-bold text-text-inverse"
        >
            P
        </div>
        <span class="text-base font-semibold tracking-tight">PointViz</span>
    </div>
</template>
