<!-- app/components/GuideFrame.vue -->
<script setup lang="ts">
withDefaults(
    defineProps<{
        color?: "strong" | "subtle"; // guide line color
    }>(),
    { color: "strong" },
);
</script>

<template>
    <div class="relative inline-block px-6 py-2 sm:px-8">
        <!-- horizontal guides -->
        <span
            class="pointer-events-none absolute -top-px left-1/2 h-px w-[110%] -translate-x-1/2 mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] sm:w-[140%]"
            :class="
                color === 'strong'
                    ? 'bg-[repeating-linear-gradient(to_right,var(--color-border-strong)_0_4px,transparent_4px_8px)]'
                    : 'bg-[repeating-linear-gradient(to_right,var(--color-border-subtle)_0_4px,transparent_4px_8px)]'
            "
        />
        <span
            class="pointer-events-none absolute -bottom-px left-1/2 h-px w-[110%] -translate-x-1/2 mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] sm:w-[140%]"
            :class="
                color === 'strong'
                    ? 'bg-[repeating-linear-gradient(to_right,var(--color-border-strong)_0_4px,transparent_4px_8px)]'
                    : 'bg-[repeating-linear-gradient(to_right,var(--color-border-subtle)_0_4px,transparent_4px_8px)]'
            "
        />
        <!-- vertical guides -->
        <span
            class="pointer-events-none absolute -left-px top-1/2 h-[130%] w-px -translate-y-1/2 mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] sm:h-[160%]"
            :class="
                color === 'strong'
                    ? 'bg-[repeating-linear-gradient(to_bottom,var(--color-border-strong)_0_4px,transparent_4px_8px)]'
                    : 'bg-[repeating-linear-gradient(to_bottom,var(--color-border-subtle)_0_4px,transparent_4px_8px)]'
            "
        />
        <span
            class="pointer-events-none absolute -right-px top-1/2 h-[130%] w-px -translate-y-1/2 mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] sm:h-[160%]"
            :class="
                color === 'strong'
                    ? 'bg-[repeating-linear-gradient(to_bottom,var(--color-border-strong)_0_4px,transparent_4px_8px)]'
                    : 'bg-[repeating-linear-gradient(to_bottom,var(--color-border-subtle)_0_4px,transparent_4px_8px)]'
            "
        />

        <slot />
    </div>
</template>
