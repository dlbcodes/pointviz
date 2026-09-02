<!-- app/layouts/app.vue -->
<script setup lang="ts">
const user = useSupabaseUser();
const feedbackModalOpen = useState("feedback-modal-open", () => false);
</script>

<template>
    <div class="flex min-h-dvh flex-col bg-bg-base text-text-primary font-sans">
        <header
            class="flex h-14 shrink-0 items-center justify-between border-b border-border-default px-6"
        >
            <NuxtLink to="/">
                <BrandMark />
            </NuxtLink>
            <div>
                <UserMenu
                    v-if="user"
                    @open-feedback="feedbackModalOpen = true"
                    variant="avatar"
                />
            </div>
        </header>

        <main class="mx-auto w-full max-w-8xl flex-1 px-6 py-8">
            <slot />
        </main>

        <FeedbackModal v-model:open="feedbackModalOpen" />
    </div>
</template>
