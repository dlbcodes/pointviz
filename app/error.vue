<script setup lang="ts">
import { computed } from "vue";
import { Button } from "@dlbcodes/ui";
import SpaceCatIcon from "~/assets/images/space-cat.png";

const props = defineProps<{
    error: { statusCode: number; statusMessage?: string };
}>();

const is404 = computed(() => props.error?.statusCode === 404);

const content = computed(() =>
    is404.value
        ? {
              title: "Lost in space",
              subtitle:
                  "We looked everywhere, but this page doesn't exist. Let's head back to safety.",
          }
        : {
              title: "Something went wrong",
              subtitle:
                  "An unexpected error occurred on our end. Try again, or head back home.",
          },
);

useHead({
    title: content.value.title,
    meta: [
        { name: "description", content: content.value.subtitle },
        { name: "robots", content: "noindex, follow" },
    ],
});

const goHome = () => clearError({ redirect: "/" });
</script>

<template>
    <div class="flex min-h-screen w-full flex-col">
        <header class="flex shrink-0 justify-between px-8 py-6">
            <NuxtLink to="/" @click.prevent="goHome">
                <BrandMark />
            </NuxtLink>
        </header>

        <main
            class="flex flex-1 flex-col items-center justify-center px-4 pb-20 text-center"
        >
            <img
                :src="SpaceCatIcon"
                alt=""
                class="mb-8 size-48 shrink-0 object-contain md:size-80"
            />

            <div class="flex flex-col items-center gap-3">
                <p class="font-mono text-sm text-text-tertiary">
                    {{ error?.statusCode ?? 404 }}
                </p>
                <h1
                    class="text-3xl font-semibold tracking-tight text-text-primary md:text-4xl"
                >
                    {{ content.title }}
                </h1>
                <p class="max-w-md text-base text-text-secondary">
                    {{ content.subtitle }}
                </p>
            </div>

            <Button class="mt-8 w-fit" @click="goHome">Back home</Button>
        </main>
    </div>
</template>
