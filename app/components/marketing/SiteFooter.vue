<script setup lang="ts">
import { PhInstagramLogo, PhFacebookLogo, PhXLogo } from "@phosphor-icons/vue";
import { nav } from "~/config/nav";

const socials = [
    {
        icon: PhInstagramLogo,
        href: "https://instagram.com",
        label: "Instagram",
    },
    {
        icon: PhFacebookLogo,
        href: "https://facebook.com",
        label: "Facebook",
    },
    {
        icon: PhXLogo,
        href: "https://x.com",
        label: "X",
    },
];
</script>

<template>
    <footer class="mt-20 w-full bg-bg-inverse">
        <div class="mx-auto flex w-full max-w-360 flex-col gap-y-16 px-6 py-12">
            <!-- main footer -->
            <div class="flex flex-col items-center gap-6 md:flex-row md:gap-0">
                <!-- brand -->
                <div class="flex md:flex-1 md:justify-start">
                    <NuxtLink to="/">
                        <BrandMark class="text-white" />
                    </NuxtLink>
                </div>

                <!-- nav -->
                <nav class="md:flex-1 md:flex md:justify-center">
                    <ul class="flex flex-row items-center gap-3 sm:gap-x-6">
                        <li v-for="link in nav" :key="link.label">
                            <NuxtLink
                                :to="link.to"
                                class="whitespace-nowrap text-sm font-medium text-text-inverse transition-colors hover:text-white/80"
                            >
                                {{ link.label }}
                            </NuxtLink>
                        </li>
                    </ul>
                </nav>

                <!-- social -->
                <div class="flex items-center gap-x-4 md:flex-1 md:justify-end">
                    <a
                        v-for="s in socials"
                        :key="s.label"
                        :href="s.href"
                        target="_blank"
                        rel="noopener noreferrer"
                        :aria-label="s.label"
                        class="text-text-inverse/75 transition-colors hover:text-text-inverse"
                    >
                        <component :is="s.icon" class="size-5 shrink-0" />
                    </a>
                </div>
            </div>

            <!-- copyright and legal -->
            <div
                class="flex flex-col items-center justify-between gap-y-2 md:flex-row"
            >
                <p class="font-mono text-xs text-text-tertiary">
                    © {{ new Date().getFullYear() }} PointViz. All rights
                    reserved.
                </p>

                <div class="flex gap-x-6">
                    <NuxtLink
                        to="/legal/privacy"
                        class="font-mono text-xs text-text-inverse/75 transition-colors hover:text-text-inverse"
                    >
                        Privacy
                    </NuxtLink>

                    <NuxtLink
                        to="/legal/terms"
                        class="font-mono text-xs text-text-inverse/75 transition-colors hover:text-text-inverse"
                    >
                        Terms
                    </NuxtLink>
                </div>
            </div>
        </div>
    </footer>
</template>
