<script setup lang="ts">
import { Button } from "@dlbcodes/ui";
import { nav } from "~/config/nav";

const userStore = useUserStore();
const isLoggedIn = computed(() => !!userStore.authUser);
const authModalOpen = useState("auth-modal-open", () => false);

const feedbackModalOpen = useState("feedback-modal-open", () => false);
const helpModalOpen = useState("help-modal-open", () => false);
const shortcutsModalOpen = useState("shortcuts-modal-open", () => false);
</script>

<template>
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
                v-for="link in nav"
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
                        <UserMenu
                            variant="avatar"
                            @open-feedback="feedbackModalOpen = true"
                            @open-help="helpModalOpen = true"
                            @open-shortcuts="shortcutsModalOpen = true"
                        />
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
</template>
