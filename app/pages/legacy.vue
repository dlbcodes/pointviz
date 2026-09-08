<!-- app/pages/index.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { useElementVisibility } from "@vueuse/core";

definePageMeta({ layout: "default" });

function scrollToBuilder() {
    document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" });
}

const builderSection = ref<HTMLElement>();
const builderVisible = useElementVisibility(builderSection, { threshold: 0.3 });
</script>

<template>
    <div class="h-full snap-y snap-mandatory overflow-y-auto">
        <section class="h-full snap-start">
            <HeroSection @start="scrollToBuilder" />
        </section>

        <section
            id="builder"
            ref="builderSection"
            class="h-full snap-start transition-all duration-700 ease-in-out"
            :class="
                builderVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-85'
            "
        >
            <ChartBuilder class="h-full" />
        </section>
    </div>
</template>
