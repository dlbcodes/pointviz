<!-- app/components/ExportMenu.vue -->
<script setup lang="ts">
import { ref } from "vue";
import {
    Button,
    Field,
    FieldLabel,
    FieldContent,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from "@dlbcodes/ui";
import {
    PhDownloadSimple,
    PhImage,
    PhArrowRight,
    PhCopy,
    PhCheck,
} from "@phosphor-icons/vue";

const { spec, title, isValid } = useChartSpec();
const { downloadPng, copyPng, effectiveBackground, hasChart } =
    useChartExport();

const scale = ref("2");
const copied = ref(false);

function exportImage() {
    const name = (title.value || "chart")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
    downloadPng({
        scale: Number(scale.value),
        filename: `${name || "chart"}.png`,
        background: effectiveBackground(spec.value),
    });
}

async function copyImage() {
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
    <Popover placement="bottom-end">
        <PopoverTrigger as-child>
            <Button
                variant="primary"
                size="sm"
                :disabled="!isValid"
                aria-label="Export chart"
            >
                <PhDownloadSimple />
                Export & Publish
            </Button>
        </PopoverTrigger>

        <PopoverContent size="sm" class="p-4 max-h-120">
            <div class="flex flex-col gap-y-4">
                <!-- Upgrade / badge section (placeholder for the future paid tier) -->
                <div class="flex flex-col gap-y-4 bg-bg-surface p-4 rounded-xl">
                    <div
                        class="bg-linear-to-r from-gray-700 via-gray-900 to-black py-6 px-4 rounded-lg"
                    >
                        <p class="text-base font-semibold text-text-inverse">
                            PointViz Badge
                        </p>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <p class="text-sm font-medium">Remove PointViz badge</p>
                        <p class="text-sm text-text-secondary">
                            Make your charts look professional by removing our
                            logo or adding your own.
                        </p>
                        <Button>
                            Upgrade to remove PointViz badge
                            <PhArrowRight />
                        </Button>
                    </div>
                </div>

                <!-- Export controls -->
                <!-- Export controls -->
                <div class="flex flex-col gap-y-1.5">
                    <label class="text-sm font-medium">Export image</label>
                    <div class="flex items-center gap-x-2 [&_button]:h-9">
                        <div>
                            <Select v-model="scale" class="w-22 shrink-0">
                                <SelectTrigger
                                    size="sm"
                                    placeholder="Size"
                                    class="h-9"
                                />
                                <SelectContent>
                                    <SelectItem value="1" label="1×"
                                        >1×</SelectItem
                                    >
                                    <SelectItem value="2" label="2×"
                                        >2×</SelectItem
                                    >
                                    <SelectItem value="3" label="3×"
                                        >3×</SelectItem
                                    >
                                    <SelectItem value="4" label="4×"
                                        >4×</SelectItem
                                    >
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            class="h-9 flex-1 w-full"
                            :disabled="!hasChart"
                            @click="copyImage"
                        >
                            <component :is="copied ? PhCheck : PhCopy" />
                            {{ copied ? "Copied" : "Copy" }}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            class="h-9 flex-1 w-full"
                            :disabled="!hasChart"
                            @click="exportImage"
                        >
                            <PhImage />
                            Download
                        </Button>
                    </div>
                </div>
            </div>
        </PopoverContent>
    </Popover>
</template>
