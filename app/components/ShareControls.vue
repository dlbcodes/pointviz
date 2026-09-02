<!-- app/components/ShareControls.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import {
    Switch,
    Input,
    Textarea,
    Field,
    FieldLabel,
    FieldContent,
    FieldDescription,
} from "@dlbcodes/ui";
import { PhLink, PhCode } from "@phosphor-icons/vue";

const { isValid } = useChartSpec();
const chartStore = useChartStore();
const user = useSupabaseUser();
const authModalOpen = useState("auth-modal-open", () => false);

const origin = computed(() =>
    import.meta.client ? window.location.origin : "",
);
const currentChart = computed(
    () =>
        chartStore.savedCharts.find(
            (c) => c.id === chartStore.currentChartId,
        ) ?? null,
);
const slug = computed(() => currentChart.value?.slug ?? null);
const isPublic = computed(() => currentChart.value?.isPublic ?? false);

const publicUrl = computed(() =>
    slug.value ? `${origin.value}/c/${slug.value}` : "",
);
const embedCode = computed(() =>
    slug.value
        ? `<iframe src="${origin.value}/embed/${slug.value}" width="640" height="360" frameborder="0"></iframe>`
        : "",
);

const publishing = ref(false);

async function togglePublic(next: boolean) {
    if (!user.value) {
        authModalOpen.value = true;
        return;
    }
    if (!isValid.value) return;

    publishing.value = true;
    try {
        if (next && !chartStore.currentChartId) {
            await chartStore.saveCurrent();
        }
        if (chartStore.currentChartId) {
            await chartStore.setPublic(chartStore.currentChartId, next);
        }
    } finally {
        publishing.value = false;
    }
}
</script>

<template>
    <section class="space-y-3">
        <Field orientation="horizontal" class="justify-between">
            <div>
                <FieldLabel>Share publicly</FieldLabel>
                <FieldDescription class="text-xs text-text-tertiary">
                    Anyone with the link can view this chart.
                </FieldDescription>
            </div>
            <FieldContent>
                <Switch
                    :model-value="isPublic"
                    :disabled="!isValid || publishing"
                    @update:model-value="togglePublic"
                />
            </FieldContent>
        </Field>

        <div v-if="isPublic && slug" class="space-y-4">
            <div class="space-y-1.5">
                <Field>
                    <FieldLabel>Public link</FieldLabel>
                    <div class="flex items-center gap-2">
                        <Input
                            :model-value="publicUrl"
                            readonly
                            size="sm"
                            class="flex-1 font-mono text-xs"
                        />
                        <CopyButton
                            :text="publicUrl"
                            :icon="PhLink"
                            class="h-9"
                        />
                    </div>
                </Field>
            </div>

            <div class="space-y-1.5">
                <Field>
                    <FieldLabel>Embed code</FieldLabel>
                    <FieldDescription>
                        Generates an embed code to add this PointViz chart to
                        your own website.
                    </FieldDescription>
                    <FieldContent
                        ><Textarea
                            :model-value="embedCode"
                            readonly
                            disabled
                            :rows="3"
                            class="font-mono text-xs"
                        />
                    </FieldContent>
                </Field>
                <CopyButton
                    :text="embedCode"
                    :icon="PhCode"
                    label="Copy embed code"
                    class="w-full"
                />
            </div>
        </div>
    </section>
</template>
