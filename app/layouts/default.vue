<script setup lang="ts"></script>

<template>
    <div
        class="flex min-h-screen w-screen flex-col overflow-hidden bg-bg-base text-text-primary font-sans"
    >
        <SiteHeader />

        <!-- default.vue -->
        <main class="flex-1 min-h-0">
            <slot />
        </main>

        <SiteFooter />

        <AppModals />
    </div>
</template>
