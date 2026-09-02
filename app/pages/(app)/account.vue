<!-- app/pages/(app)/account.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
    Button,
    Input,
    Field,
    FieldLabel,
    FieldContent,
    FieldError,
} from "@dlbcodes/ui";

definePageMeta({ layout: "app", middleware: "auth" });

const userStore = useUserStore();
const { signOut } = useAuth();
const upgradeModalOpen = useState("upgrade-modal-open", () => false);

// Ensure the profile is loaded (fetchProfile hydrates plan/usage/name).
onMounted(() => {
    if (!userStore.profile) userStore.fetchProfile();
});

const profile = computed(() => userStore.profile);

// ── Profile edit ──
const name = ref("");
const saving = ref(false);
const saveError = ref<string | null>(null);
const savedOk = ref(false);

// seed the name field once profile loads
watch(
    profile,
    (p) => {
        if (p && !name.value) name.value = p.name ?? "";
    },
    { immediate: true },
);

async function saveProfile() {
    if (saving.value) return;
    saving.value = true;
    saveError.value = null;
    savedOk.value = false;
    try {
        await userStore.updateProfile({ name: name.value.trim() });
        savedOk.value = true;
        setTimeout(() => (savedOk.value = false), 2000);
    } catch (e) {
        saveError.value = (e as Error).message ?? "Couldn't save.";
    } finally {
        saving.value = false;
    }
}

// ── Plan / usage ──
const FREE_LIMIT = 25;
const usagePct = computed(() =>
    profile.value
        ? Math.min(100, (profile.value.customizeCount / FREE_LIMIT) * 100)
        : 0,
);
const isPro = computed(() => profile.value?.plan === "PRO");
</script>

<template>
    <div class="space-y-8">
        <h1 class="text-xl font-semibold">Account</h1>

        <!-- Profile -->
        <section class="space-y-4 rounded-xl border border-border-default p-5">
            <h2 class="text-sm font-medium text-text-primary">Profile</h2>

            <Field>
                <FieldLabel>Name</FieldLabel>
                <FieldContent>
                    <Input v-model="name" placeholder="Your name" />
                    <FieldError v-if="saveError">{{ saveError }}</FieldError>
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel>Email</FieldLabel>
                <FieldContent>
                    <Input
                        :model-value="profile?.email ?? ''"
                        readonly
                        class="text-text-tertiary"
                    />
                </FieldContent>
            </Field>

            <div class="flex items-center gap-3">
                <Button size="sm" :disabled="saving" @click="saveProfile">
                    {{ saving ? "Saving…" : "Save changes" }}
                </Button>
                <span v-if="savedOk" class="text-xs text-text-tertiary"
                    >Saved</span
                >
            </div>
        </section>

        <!-- Plan -->
        <section class="space-y-4 rounded-xl border border-border-default p-5">
            <div class="flex items-center justify-between">
                <h2 class="text-sm font-medium text-text-primary">Plan</h2>
                <span
                    class="rounded-full px-2 py-0.5 text-xs font-medium"
                    :class="
                        isPro
                            ? 'bg-brand-200 text-text-inverse'
                            : 'bg-bg-subtle text-text-secondary'
                    "
                >
                    {{ isPro ? "Pro" : "Free" }}
                </span>
            </div>

            <div v-if="!isPro" class="space-y-2">
                <div
                    class="flex items-center justify-between text-xs text-text-secondary"
                >
                    <span>AI customizations today</span>
                    <span
                        >{{ profile?.customizeCount ?? 0 }} /
                        {{ FREE_LIMIT }}</span
                    >
                </div>
                <div
                    class="h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle"
                >
                    <div
                        class="h-full rounded-full bg-chart-teal transition-all"
                        :style="{ width: `${usagePct}%` }"
                    />
                </div>
                <Button
                    variant="primary"
                    size="sm"
                    class="mt-2"
                    @click="upgradeModalOpen = true"
                >
                    Upgrade to Pro
                </Button>
            </div>

            <p v-else class="text-sm text-text-secondary">
                You have unlimited AI customizations.
            </p>
        </section>

        <!-- Account -->
        <section class="space-y-4 rounded-xl border border-border-default p-5">
            <h2 class="text-sm font-medium text-text-primary">Account</h2>
            <Button variant="outline" size="sm" @click="signOut"
                >Sign out</Button
            >
        </section>
    </div>
</template>
