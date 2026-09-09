<!-- app/components/StyleMarquee.vue -->
<script setup lang="ts">
const styles = [
    { src: "/showcase/ft_style.webp", label: "Financial Times" },
    { src: "/showcase/apple_style.webp", label: "Apple Fitness" },
    { src: "/showcase/customer_traffic.webp", label: "The Economist" },
    { src: "/showcase/mrr_growth.webp", label: "OECD" },
    { src: "/showcase/eccomerce_revenue.webp", label: "OECD" },
];
// duplicate for seamless loop
const loop = [...styles, ...styles];
</script>

<template>
    <section class="relative overflow-hidden py-16">
        <div class="mb-8 text-center">
            <span
                class="font-mono text-xs uppercase tracking-widest text-chart-teal"
                >Any style you want</span
            >
            <h2
                class="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl"
            >
                From newsroom to fitness app
            </h2>
        </div>

        <!-- edge fade so images enter/exit softly -->
        <div
            class="relative [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
            <div class="flex w-max animate-marquee gap-6">
                <div
                    v-for="(style, i) in loop"
                    :key="i"
                    class="w-80 shrink-0 overflow-hidden rounded-xl border border-border-subtle"
                >
                    <img
                        :src="style.src"
                        :alt="style.label"
                        class="aspect-16/10 w-full object-cover"
                        loading="lazy"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
@keyframes marquee {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-50%);
    } /* moves through the first copy; loop is duplicated */
}
.animate-marquee {
    animation: marquee 40s linear infinite;
}
.animate-marquee:hover {
    animation-play-state: paused; /* pause on hover so people can look */
}
</style>
