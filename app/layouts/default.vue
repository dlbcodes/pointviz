<!-- app/layouts/default.vue -->
<script setup lang="ts">
import { Button } from "@dlbcodes/ui";

const userStore = useUserStore();
const isLoggedIn = computed(() => !!userStore.authUser);
const authModalOpen = useState("auth-modal-open", () => false);

const marketingLinks = [
    { label: "How it works", to: "/how-it-works" },
    { label: "Pricing", to: "/pricing" },
];
</script>

<template>
    <div
        class="flex h-screen w-screen flex-col overflow-hidden bg-bg-base text-text-primary font-sans"
    >
        <header
            class="grid h-14 shrink-0 grid-cols-3 items-center border-b border-border-default px-6"
        >
            <!-- Center: logo -->
            <div class="flex">
                <NuxtLink to="/">
                    <BrandMark />
                </NuxtLink>
            </div>

            <!-- Left: marketing nav -->
            <nav class="flex items-center justify-center gap-8">
                <NuxtLink
                    v-for="link in marketingLinks"
                    :key="link.to"
                    :to="link.to"
                    class="hidden font-mono text-xs tracking-tight text-text-primary transition-colors hover:text-text-primary md:inline"
                >
                    {{ link.label }}
                </NuxtLink>
            </nav>

            <!-- Right: auth -->
            <div class="flex items-center justify-end gap-3">
                <ClientOnly>
                    <template v-if="isLoggedIn">
                        <div class="flex items-center gap-3">
                            <Button to="/charts" variant="primary" size="sm">
                                Dashboard
                            </Button>
                            <UserMenu variant="avatar" />
                        </div>
                    </template>
                    <template v-else>
                        <NuxtLink to="/login">
                            <Button variant="ghost" size="sm">Log in</Button>
                        </NuxtLink>
                        <Button
                            variant="primary"
                            size="sm"
                            @click="authModalOpen = true"
                        >
                            Sign up
                        </Button>
                    </template>
                </ClientOnly>
            </div>
        </header>

        <!-- default.vue -->
        <div class="flex-1 min-h-0">
            <slot />
        </div>

        <AppModals />
    </div>
</template>
