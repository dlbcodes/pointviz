<!-- app/pages/(app)/charts/[id].vue -->
<script setup lang="ts">
definePageMeta({ layout: "builder", middleware: "auth" });

const route = useRoute();
const chartStore = useChartStore();

// Load the owned chart into the builder before render.
await chartStore.openChart(route.params.id as string);
</script>

<template>
    <ChartBuilder />
</template>
