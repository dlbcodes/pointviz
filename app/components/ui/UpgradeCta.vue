<script setup lang="ts">
import { PhArrowCircleUp } from "@phosphor-icons/vue";
</script>

<template>
    <div class="flex items-center justify-between">
        <div class="group flex min-w-0 items-center gap-1.5 font-mono text-sm">
            <PhArrowCircleUp
                class="size-6 text-text-tertiary transition-colors group-hover:text-orange-600"
            />
            <span class="truncate font-medium leading-4 text-text-primary">
                Upgrade to <strong class="text-orange-600">Pro</strong>
            </span>
        </div>
        <div class="flex w-min shrink-0 overflow-hidden rounded">
            <div
                class="h-4 w-1.5"
                style="background-color: rgb(243, 153, 14)"
            />
            <div class="h-4 w-1.5" style="background-color: rgb(255, 142, 4)" />
            <div class="h-4 w-1.5" style="background-color: rgb(251, 94, 13)" />
            <div class="h-4 w-1.5" style="background-color: rgb(235, 42, 7)" />
            <div class="h-4 w-1.5" style="background-color: rgb(204, 9, 25)" />
        </div>
    </div>
</template>
