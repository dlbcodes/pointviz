<!-- pages/(auth)/confirm.vue -->
<script setup lang="ts">
definePageMeta({ layout: "auth" });

const user = useSupabaseUser();
const route = useRoute();

const target = computed(() => {
    const r = route.query.redirect;
    const t = Array.isArray(r) ? r[0] : r;
    return t && t.startsWith("/") ? t : "/";
});

watch(
    user,
    (u) => {
        if (u) navigateTo(target.value);
    },
    { immediate: true },
);
</script>

<template>
    <div class="text-center">
        <p class="text-text-secondary">Signing you in…</p>
    </div>
</template>
