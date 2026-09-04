<!-- ChartBuilder.vue -->
<script setup lang="ts">
const exportPanelOpen = useState("export-panel-open", () => true);
</script>

<template>
    <div class="flex flex-1 overflow-hidden">
        <AppSidebar />
        <ChartStage />
        <ExportPanel v-if="exportPanelOpen" @close="exportPanelOpen = false" />
    </div>
</template>
