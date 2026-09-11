<script setup lang="ts">
import { ref, useId, onBeforeUnmount } from "vue";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/vue";

const props = withDefaults(
    defineProps<{
        text?: string;
        delay?: number; // ms before showing
        hideDelay?: number; // ms before hiding
    }>(),
    {
        delay: 0,
        hideDelay: 0,
    },
);

const reference = ref(null);
const floating = ref(null);
const open = ref(false);
const tooltipId = useId();

let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function clearTimers() {
    if (showTimer) clearTimeout(showTimer);
    if (hideTimer) clearTimeout(hideTimer);
    showTimer = null;
    hideTimer = null;
}

function show() {
    clearTimers();
    if (props.delay > 0) {
        showTimer = setTimeout(() => (open.value = true), props.delay);
    } else {
        open.value = true;
    }
}

function hide() {
    clearTimers();
    if (props.hideDelay > 0) {
        hideTimer = setTimeout(() => (open.value = false), props.hideDelay);
    } else {
        open.value = false;
    }
}

onBeforeUnmount(clearTimers);

const { floatingStyles } = useFloating(reference, floating, {
    placement: "top",
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
});
</script>

<template>
    <span
        ref="reference"
        class="tooltip-trigger"
        :aria-describedby="tooltipId"
        tabindex="0"
        @mouseenter="show"
        @mouseleave="hide"
        @focus="show"
        @blur="hide"
    >
        <slot />
    </span>

    <div
        v-if="open"
        ref="floating"
        :style="floatingStyles"
        class="tooltip-anchor"
    >
        <Transition name="tooltip-fade" appear>
            <div :id="tooltipId" class="tooltip-bubble" role="tooltip">
                <slot name="content">{{ text }}</slot>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.tooltip-trigger {
    display: inline-block;
}

.tooltip-anchor {
    z-index: 50;
    pointer-events: none;
}

.tooltip-bubble {
    background: #18181b;
    color: white;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 6px;
    white-space: nowrap;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
    transition:
        opacity 0.12s ease,
        transform 0.12s ease;
}
.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
    opacity: 0;
    transform: translateY(4px) scale(0.96);
}
</style>
