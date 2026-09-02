<script setup lang="ts">
import { PhArrowCircleUp } from "@phosphor-icons/vue";

const upgradeModalOpen = useState("upgrade-modal-open", () => false);

const bars = [
    "rgb(243, 153, 14)",
    "rgb(255, 142, 4)",
    "rgb(251, 94, 13)",
    "rgb(235, 42, 7)",
    "rgb(204, 9, 25)",
];
</script>

<template>
    <button
        type="button"
        class="group flex w-full items-center justify-between outline-none cursor-pointer"
        @click="upgradeModalOpen = true"
    >
        <div class="flex min-w-0 items-center gap-1.5 font-mono text-sm">
            <PhArrowCircleUp
                class="size-6 text-text-tertiary transition-colors group-hover:text-orange-600"
            />
            <span class="truncate font-medium leading-4 text-text-primary">
                Upgrade to <strong class="text-orange-600">Pro</strong>
            </span>
        </div>

        <div class="flex w-min shrink-0 items-end overflow-hidden rounded">
            <div
                v-for="(color, i) in bars"
                :key="i"
                class="w-1.5 origin-bottom transition-all"
                :style="{ backgroundColor: color, height: '1rem', '--i': i }"
            />
        </div>
    </button>
</template>

<style scoped>
/* Idle: bars sit at full height. On hover: each bar dances with a staggered delay. */
.group:hover > div > div {
    animation: dance 0.8s ease-in-out infinite;
    animation-delay: calc(var(--i) * 0.08s);
}

@keyframes dance {
    0%,
    100% {
        transform: scaleY(1);
    }
    50% {
        transform: scaleY(0.45);
    }
}
</style>
