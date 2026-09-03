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
import { PhDotsThree, PhCopy, PhTrash } from "@phosphor-icons/vue";
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
        class="group flex flex-col overflow-hidden rounded-xl border border-border-default transition-colors hover:border-border-strong"
    >
        <!-- Thumbnail -->
        <div
            class="aspect-16/10 w-full overflow-hidden border-b border-border-default bg-bg-base pointer-events-none"
        >
            <ClientOnly>
                <VChart
                    v-if="option"
                    :option="option"
                    autoresize
                    class="h-full w-full p-2"
                />
            </ClientOnly>
        </div>

        <!-- Meta row: title/date left, menu right -->
        <div class="flex items-center justify-between gap-2 p-3">
            <div class="min-w-0">
                <p
                    class="truncate text-sm font-medium text-text-primary group-hover:text-chart-teal transition-colors"
                >
                    {{ title || "Untitled chart" }}
                </p>
                <p class="mt-0.5 text-xs text-text-tertiary">
                    Last edited {{ timeAgo }}
                </p>
            </div>

            <!-- Menu — stop clicks from navigating the card -->
            <div class="shrink-0" @click.prevent.stop>
                <Dropdown placement="bottom-end">
                    <DropdownTrigger
                        class="flex size-7 items-center justify-center rounded-md text-text-tertiary outline-none transition-colors hover:bg-bg-subtle hover:text-text-primary"
                        aria-label="Chart options"
                    >
                        <PhDotsThree class="size-4" weight="bold" />
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

        <!-- Delete confirmation -->
        <DeleteModal
            v-model:open="deleteModalOpen"
            :chart-name="title"
            @confirm="confirmDelete"
        />
    </NuxtLink>
</template>
