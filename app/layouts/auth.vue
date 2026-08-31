<template>
    <div
        class="relative flex min-h-dvh flex-col items-center justify-center gap-8 bg-bg-base px-4"
    >
        <div
            class="pointer-events-none absolute inset-0"
            style="
                background: radial-gradient(
                    60% 50% at 50% 0%,
                    color-mix(
                        in oklch,
                        var(--color-brand-200) 12%,
                        transparent
                    ),
                    transparent
                );
            "
        ></div>
        <NuxtLink to="/">
            <BrandMark />
        </NuxtLink>
        <div class="max-w-md w-full">
            <slot />
        </div>
    </div>
</template>
