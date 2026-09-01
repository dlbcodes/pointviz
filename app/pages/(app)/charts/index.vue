<!-- app/pages/(app)/charts/index.vue -->
<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "auth" });

const chartStore = useChartStore();
await chartStore.fetchCharts();
</script>

<template>
    <div>
        <h1 class="mb-6 text-xl font-semibold">My charts</h1>
        <!-- chart list built next -->
    </div>
</template>
