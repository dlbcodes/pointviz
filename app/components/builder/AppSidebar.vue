<script setup lang="ts">
import { ref, computed } from "vue";
import {
    PhBracketsCurly,
    PhFile,
    PhTable,
    PhSparkle,
    PhDotsSixVertical,
} from "@phosphor-icons/vue";
import { useResizable } from "~/composables/useResizable";

const { width, dragging, startResize } = useResizable({
    min: 280,
    max: 560,
    initial: 340,
    key: "pointviz:sidebar-width",
});

const user = useSupabaseUser();

type Tab = "examples" | "ai" | "csv" | "json";

// Tabs available depend on auth: examples only for logged-out (onboarding).
const tabs = computed(() => {
    const base = [
        { id: "ai" as const, label: "AI", icon: PhSparkle },
        { id: "csv" as const, label: "CSV", icon: PhTable },
        { id: "json" as const, label: "JSON", icon: PhBracketsCurly },
    ];
    return user.value
        ? base
        : [
              { id: "examples" as const, label: "Examples", icon: PhFile },
              ...base,
          ];
});

// Default tab: examples for logged-out (onboarding), AI for logged-in.
const activeTab = ref<Tab>(user.value ? "ai" : "examples");

// If auth state changes and the active tab disappears, fall back.
watch(user, (u) => {
    if (u && activeTab.value === "examples") activeTab.value = "ai";
});

const feedbackModalOpen = useState("feedback-modal-open", () => false);
const helpModalOpen = useState("help-modal-open", () => false);
const shortcutsModalOpen = useState("shortcuts-modal-open", () => false);
</script>

<template>
    <aside
        class="relative hidden md:flex shrink-0 flex-col border-r border-border-default"
        :class="dragging ? 'border-brand-100' : ''"
        :style="{ width: `${width}px` }"
    >
        <div class="flex border-b border-border-default">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="flex flex-1 items-center justify-center gap-x-1 border-b-2 px-4 py-4 font-mono text-[13px] tracking-tight transition-colors"
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

        <div class="flex-1 overflow-y-auto p-5">
            <ExamplesPanel
                v-if="activeTab === 'examples'"
                @loaded="activeTab = 'json'"
            />
            <AiPanel
                v-else-if="activeTab === 'ai'"
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

        <!-- resize handle unchanged -->
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
