<script setup lang="ts">
import { computed } from "vue";

interface Praise {
    quote: string;
    who: string;
}

const props = withDefaults(
    defineProps<{
        items: Praise[];
        speed?: number | string;
        direction?: "left" | "right";
        pauseOnHover?: boolean;
        ariaLabel?: string;
    }>(),
    {
        speed: 60,
        direction: "left",
        pauseOnHover: true,
        ariaLabel: "What people are saying",
    },
);

const duration = computed(() =>
    typeof props.speed === "number" ? `${props.speed}s` : props.speed,
);
</script>

<template>
    <div
        role="region"
        :aria-label="ariaLabel"
        :style="{ '--praise-duration': duration }"
        class="group relative overflow-hidden py-2 mask-[linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] motion-reduce:overflow-x-auto motion-reduce:mask-none"
    >
        <div
            class="flex w-max animate-[praise-scroll_var(--praise-duration)_linear_infinite] motion-reduce:animate-none"
            :class="[
                direction === 'right' && '[animation-direction:reverse]',
                pauseOnHover && 'group-hover:[animation-play-state:paused]',
            ]"
        >
            <!-- Rendered twice so the loop is seamless: the animation shifts by -50%,
           landing the start of the second copy exactly where the first began.
           The duplicate is hidden from assistive tech and collapsed when the
           user prefers reduced motion. -->
            <ul
                v-for="copy in 2"
                :key="copy"
                :aria-hidden="copy === 2 || undefined"
                class="flex items-stretch gap-3.5 pr-3.5"
                :class="copy === 2 && 'motion-reduce:hidden'"
            >
                <li
                    v-for="(item, i) in items"
                    :key="`${copy}-${i}`"
                    class="praise-pill flex max-w-88 items-center gap-2 whitespace-nowrap rounded-full bg-bg-raised px-4 py-px"
                >
                    <p
                        :title="item.quote"
                        class="min-w-0 truncate text-xs font-medium text-text-primary"
                    >
                        {{ item.quote }}
                    </p>
                    <span aria-hidden="true" class="shrink-0 text-text-tertiary"
                        >·</span
                    >
                    <span class="shrink-0 text-xs text-text-secondary">{{
                        item.who
                    }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style>
@keyframes praise-scroll {
    to {
        transform: translateX(-50%);
    }
}

.praise-pill {
    box-shadow:
        color-mix(in oklab, var(--color-bg-subtle) 80%, transparent) 0 0 0 1px
            inset,
        color-mix(in oklab, var(--color-bg-subtle) 50%, transparent) 0 1px 2px;
}
</style>
