<!-- app/components/ChartCard.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useTimeAgo } from "@vueuse/core";
import {
    Dropdown,
    DropdownTrigger,
    DropdownContent,
    DropdownItem,
} from "@dlbcodes/ui";
import {
    PhDotsThree,
    PhDotsThreeVertical,
    PhCopy,
    PhTrash,
} from "@phosphor-icons/vue";
import { compileToECharts } from "~/lib/compile";
import { resolveTheme, type ChartTheme } from "~/lib/theme";
import type { ChartSpec } from "~/lib/schema";

const props = defineProps<{
    id: string;
    title: string | null;
    spec: ChartSpec;
    updatedAt: string;
}>();

const chartStore = useChartStore();
const theme = ref<ChartTheme | null>(null);
const timeAgo = useTimeAgo(() => new Date(props.updatedAt));

onMounted(() => {
    theme.value = resolveTheme();
});

const option = computed(() =>
    theme.value
        ? compileToECharts(props.spec, theme.value, { preview: true })
        : null,
);

const deleteModalOpen = ref(false);

async function duplicate() {
    await chartStore.duplicateChart(props.id);
}

async function confirmDelete() {
    try {
        await chartStore.deleteChart(props.id);
    } finally {
        deleteModalOpen.value = false;
    }
}
</script>

<template>
    <NuxtLink
        :to="`/charts/${id}`"
        class="group relative flex flex-col bg-bg-base"
    >
        <!-- Thumbnail with a subtle inner frame -->
        <div
            class="relative aspect-16/10 w-full overflow-hidden rounded-3xl border border-border-subtle bg-bg-surface p-3"
        >
            <!-- transparent chart on top -->
            <div class="pointer-events-none absolute inset-3">
                <ClientOnly>
                    <VChart
                        v-if="option"
                        :option="option"
                        autoresize
                        class="h-full w-full"
                    />
                </ClientOnly>
            </div>
        </div>

        <!-- Meta -->
        <!-- Meta row: title/date left, menu right -->
        <div class="flex items-center justify-between gap-2 px-4 py-3">
            <div class="min-w-0">
                <p
                    class="truncate text-sm font-medium tracking-tight text-text-primary underline decoration-transparent decoration-1 underline-offset-[3px] transition-colors duration-200 group-hover:decoration-text-primary"
                >
                    {{ title || "Untitled chart" }}
                </p>
                <p class="mt-0.5 text-xs text-text-tertiary">
                    Edited {{ timeAgo }}
                </p>
            </div>

            <!-- Menu — fades in on hover, stays for focus/open -->
            <div class="shrink-0" @click.prevent.stop>
                <Dropdown placement="bottom-end">
                    <DropdownTrigger
                        class="flex size-7 items-center justify-center rounded-lg text-text-tertiary opacity-0 outline-none transition-all duration-200 hover:bg-bg-subtle hover:text-text-primary focus-visible:opacity-100 group-hover:opacity-100 data-[state=open]:opacity-100 data-[state=open]:bg-bg-subtle"
                        aria-label="Chart options"
                    >
                        <PhDotsThreeVertical class="size-4" weight="bold" />
                    </DropdownTrigger>

                    <DropdownContent size="fit" class="p-1">
                        <DropdownItem @click="duplicate">
                            <PhCopy
                                class="size-4 text-text-tertiary"
                                aria-hidden="true"
                            />
                            Duplicate
                        </DropdownItem>
                        <DropdownItem
                            class="text-danger-text hover:text-danger-text"
                            @click="deleteModalOpen = true"
                        >
                            <PhTrash class="size-4" aria-hidden="true" />
                            Delete
                        </DropdownItem>
                    </DropdownContent>
                </Dropdown>
            </div>
        </div>

        <DeleteModal
            v-model:open="deleteModalOpen"
            :chart-name="title"
            @confirm="confirmDelete"
        />
    </NuxtLink>
</template>
