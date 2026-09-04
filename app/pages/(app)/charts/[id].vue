<!-- app/pages/(app)/charts/[id].vue -->
<script setup lang="ts">
definePageMeta({ layout: "builder" });

const route = useRoute();
const chartStore = useChartStore();

// Load the owned chart into the builder before render.
onMounted(async () => {
    try {
        await chartStore.openChart(route.params.id as string);
    } catch {
        // chart not found / not yours — send them to their library
        await navigateTo("/charts");
    }
});
</script>

<template>
    <ChartBuilder />
</template>
