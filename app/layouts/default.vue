<!-- layouts/default.vue -->
<script setup lang="ts">
import { Button, Field, FieldContent, FieldLabel } from "@dlbcodes/ui";
import { Popover, PopoverTrigger, PopoverContent } from "@dlbcodes/ui";
import { PhDownloadSimple, PhImage } from "@phosphor-icons/vue";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@dlbcodes/ui";

const { title, isValid } = useChartSpec();
</script>

<template>
    <div
        class="flex h-screen w-screen flex-col overflow-hidden bg-bg-base text-text-primary font-sans"
    >
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

            <!-- Actions -->
            <ExportMenu />
        </header>

        <slot />
    </div>
</template>
