<script setup lang="ts">
import { watch } from "vue";
definePageMeta({ layout: "builder" });

const route = useRoute();
const chartStore = useChartStore();

async function load(id: string) {
    try {
        await chartStore.openChart(id);
    } catch {
        await navigateTo("/charts");
    }
}

watch(
    () => route.params.id,
    (id) => {
        if (id) load(id as string);
    },
    { immediate: true },
);
</script>

<template>
    <ChartBuilder />
</template>
