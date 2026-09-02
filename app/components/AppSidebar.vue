<!-- components/AppSidebar.vue -->
<script setup lang="ts">
import { ref } from "vue";
import {
    PhBracketsCurly,
    PhFile,
    PhTable,
    PhDotsSixVertical,
} from "@phosphor-icons/vue";
import { useResizable } from "~/composables/useResizable";

const { width, dragging, startResize } = useResizable({
    min: 280,
    max: 560,
    initial: 360,
    key: "pointviz:sidebar-width",
});

type Tab = "examples" | "csv" | "json";
const activeTab = ref<Tab>("examples");
const { error, isValid } = useChartSpec();

const tabs = [
    { id: "examples" as const, label: "Examples", icon: PhFile },
    { id: "csv" as const, label: "CSV", icon: PhTable },
    { id: "json" as const, label: "JSON", icon: PhBracketsCurly },
];

const user = useSupabaseUser();
const feedbackModalOpen = useState("feedback-modal-open", () => false);
const helpModalOpen = useState("help-modal-open", () => false);
const shortcutsModalOpen = useState("shortcuts-modal-open", () => false);
</script>

<template>
    <aside
        class="relative hidden md:flex shrink-0 flex-col border-r border-border-default"
        :class="dragging ? 'border-brand-100 ' : ''"
        :style="{ width: `${width}px` }"
    >
        <!-- Tabs (data entry only) -->
        <div class="flex border-b border-border-default">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="flex flex-1 items-center justify-center gap-x-1 px-4 py-4 text-[13px] transition-colors border-b-2 font-mono tracking-tight"
                :class="
                    activeTab === tab.id
                        ? 'border-chart-teal text-chart-teal'
                        : 'border-transparent text-text-tertiary hover:text-text-secondary'
                "
            >
                <component :is="tab.icon" />
                {{ tab.label }}
            </button>
        </div>

        <!-- Panels -->
        <div class="flex-1 overflow-y-auto p-5">
            <ExamplesPanel
                v-if="activeTab === 'examples'"
                @loaded="activeTab = 'json'"
            />
            <CsvPanel v-else-if="activeTab === 'csv'" />
            <JsonPanel v-else-if="activeTab === 'json'" />
        </div>

        <footer v-if="user" class="shrink-0 border-t border-border-default p-2">
            <UserMenu
                @open-feedback="feedbackModalOpen = true"
                @open-help="helpModalOpen = true"
                @open-shortcuts="shortcutsModalOpen = true"
            />
        </footer>

        <!-- Resize handle with grip affordance -->
        <div
            class="group absolute top-0 -right-1.5 z-10 flex h-full w-3 cursor-col-resize items-center justify-center select-none"
            @pointerdown.prevent="startResize"
        >
            <div
                class="flex h-8 w-3 items-center justify-center rounded-full border border-border-default bg-bg-base text-text-tertiary transition-colors hover:border-brand-100 hover:text-brand-100"
                :class="dragging ? 'border-brand-100 text-brand-100' : ''"
            >
                <PhDotsSixVertical class="size-3" />
            </div>
        </div>
    </aside>
</template>
