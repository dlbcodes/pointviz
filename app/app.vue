<script setup lang="ts">
if (!import.meta.dev) {
    useHead({
        script: [{ src: "/_vercel/insights/script.js", defer: true }],
    });
}
</script>
<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
