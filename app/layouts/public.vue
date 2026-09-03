<!-- app/layouts/public.vue -->
<template>
    <div class="flex min-h-dvh flex-col bg-bg-base text-text-primary font-sans">
        <header class="flex h-14 shrink-0 items-center justify-center">
            <NuxtLink to="/">
                <BrandMark />
            </NuxtLink>
        </header>

        <main class="flex flex-1 items-center justify-center p-6">
            <slot />
        </main>
    </div>
</template>
