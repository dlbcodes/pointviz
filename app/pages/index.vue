<!-- app/pages/index.vue -->
<script setup lang="ts">
definePageMeta({ layout: "default" });

const items = [
    { who: "Mara", quote: "Built a complex chart in seconds." },
    { who: "Devin", quote: "Describing the chart is faster than drawing it." },
    { who: "Priya", quote: "My dashboards finally look professional." },
    { who: "Tom", quote: "Cleaned and visualized my messy CSV instantly." },
    { who: "Ana", quote: "Sharing interactive charts is a game changer." },
    // NEW: Marketing focused
    {
        who: "Sarah",
        quote: "Turned a boring data report into a viral LinkedIn post.",
    },
    {
        who: "Leo",
        quote: "Our campaign landing page conversions jumped with these visuals.",
    },
];
</script>

<template>
    <div>
        <HeroSection />
        <StyleMarquee />
        <HowItWorks />
        <ExamplesShowcase />
        <PraiseWall :items="items" class="pb-20" />
        <Cta />
    </div>
</template>
