<!-- app/components/ImageExport.vue -->
<script setup lang="ts">
import { ref } from "vue";
import {
    Button,
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from "@dlbcodes/ui";
import { PhDownloadSimple, PhCopy, PhCheck } from "@phosphor-icons/vue";

const { spec } = useChartSpec();
const { downloadPng, copyPng, effectiveBackground, hasChart } =
    useChartExport();

const scale = ref("2");
const copied = ref(false);

function download() {
    downloadPng({
        scale: Number(scale.value),
        background: effectiveBackground(spec.value),
    });
}
async function copy() {
    const ok = await copyPng({
        scale: Number(scale.value),
        background: effectiveBackground(spec.value),
    });
    if (ok) {
        copied.value = true;
        setTimeout(() => (copied.value = false), 1500);
    }
}
</script>

<template>
    <section class="space-y-3">
        <h3
            class="text-xs font-medium uppercase tracking-wider text-text-tertiary"
        >
            Image
        </h3>

        <!-- Quality as segmented control — more tactile than a dropdown for 3 options -->
        <div class="space-y-1.5">
            <label class="text-xs text-text-secondary">Resolution</label>
            <div class="flex rounded-lg border border-border-default p-0.5">
                <button
                    v-for="s in ['1', '2', '3']"
                    :key="s"
                    class="flex-1 rounded-md py-1.5 text-xs font-medium transition-colors"
                    :class="
                        scale === s
                            ? 'bg-bg-subtle text-text-primary'
                            : 'text-text-tertiary hover:text-text-secondary'
                    "
                    @click="scale = s"
                >
                    {{ s }}×
                </button>
            </div>
        </div>

        <!-- Actions: download is primary, copy secondary -->
        <div class="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                class="flex-1"
                :disabled="!hasChart"
                @click="copy"
            >
                <component :is="copied ? PhCheck : PhCopy" class="size-4" />
                {{ copied ? "Copied" : "Copy" }}
            </Button>
            <Button
                variant="primary"
                size="sm"
                class="flex-1"
                :disabled="!hasChart"
                @click="download"
            >
                <PhDownloadSimple class="size-4" />
                Download
            </Button>
        </div>
    </section>
</template>
