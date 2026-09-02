<!-- app/layouts/public.vue -->
<template>
    <div class="flex min-h-dvh flex-col bg-bg-base text-text-primary font-sans">
        <header
            class="flex h-14 shrink-0 items-center justify-between border-b border-border-default px-6"
        >
            <NuxtLink to="/">
                <BrandMark />
            </NuxtLink>
            <NuxtLink to="/">
                <Button variant="primary" size="sm">Make your own</Button>
            </NuxtLink>
        </header>

        <main class="flex flex-1 items-center justify-center p-6">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import { Button } from "@dlbcodes/ui";
</script>
