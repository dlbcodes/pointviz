<!-- layouts/default.vue -->
<script setup lang="ts">
import { Button } from "@dlbcodes/ui";

const { title, isValid } = useChartSpec();
</script>

<template>
    <div
        class="flex h-screen w-screen flex-col overflow-hidden bg-bg-base text-text-primary font-sans"
    >
        <!-- TOP HEADER (global chrome) -->
        <header
            class="flex h-14 shrink-0 items-center justify-between border-b border-border-default px-6"
        >
            <!-- Brand -->
            <div class="flex items-center gap-3">
                <div
                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-200 text-sm font-bold text-text-inverse"
                >
                    P
                </div>
                <h1 class="text-base font-semibold tracking-tight">PointViz</h1>
                <span
                    class="rounded-full bg-bg-subtle px-2 py-0.5 text-xs text-text-tertiary"
                    >v0.1</span
                >
            </div>

            <!-- Dynamic chart title (from shared state) -->
            <div class="flex flex-1 justify-center px-4">
                <h2
                    class="max-w-md truncate font-mono text-sm font-medium"
                    :class="title ? 'text-text-primary' : 'text-text-tertiary'"
                >
                    {{ title || "Untitled chart" }}
                </h2>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
                <Button variant="outline" size="sm" :disabled="!isValid">
                    Export PNG
                </Button>
            </div>
        </header>

        <!-- Builder surface (sidebar + stage) lives in the page -->
        <slot />
    </div>
</template>
