<!-- app/pages/(app)/account.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import {
    Button,
    Input,
    Field,
    FieldLabel,
    FieldContent,
    FieldError,
    Progress,
} from "@dlbcodes/ui";
import { PhCheck } from "@phosphor-icons/vue";
import { PRICING_TIERS } from "~/lib/pricing";
import { PLANS } from "~~/shared/plans";

definePageMeta({ layout: "app" });

const userStore = useUserStore();
const upgradeModalOpen = useState("upgrade-modal-open", () => false);

onMounted(() => {
    if (!userStore.profile) userStore.fetchProfile();
});

const profile = computed(() => userStore.profile);

// ── Settings nav ──
const sections = [
    { id: "profile", label: "Profile" },
    { id: "plan", label: "Plan & Billing" },
] as const;
const active = ref<(typeof sections)[number]["id"]>("profile");

// ── Profile ──
const name = ref("");
const saving = ref(false);
const saveError = ref<string | null>(null);
const savedOk = ref(false);

watch(
    profile,
    (p) => {
        if (p && !name.value) name.value = p.name ?? "";
    },
    { immediate: true },
);

const dirty = computed(() => name.value.trim() !== (profile.value?.name ?? ""));

async function saveProfile() {
    if (saving.value || !dirty.value) return;
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

// ── Plan ──
const isPro = computed(() => profile.value?.plan === "PRO");
const freeLimit = PLANS.FREE.customizeLimit;
const used = computed(() => profile.value?.customizeCount ?? 0);
</script>

<template>
    <div class="mx-auto flex max-w-4xl gap-10">
        <!-- Left settings nav -->
        <nav class="w-48 shrink-0">
            <h1 class="mb-4 px-3 text-lg font-semibold tracking-tight">
                Settings
            </h1>
            <div class="space-y-0.5">
                <button
                    v-for="s in sections"
                    :key="s.id"
                    class="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors"
                    :class="
                        active === s.id
                            ? 'bg-bg-subtle font-medium text-text-primary'
                            : 'text-text-secondary hover:bg-bg-subtle/50 hover:text-text-primary'
                    "
                    @click="active = s.id"
                >
                    {{ s.label }}
                </button>
            </div>
        </nav>

        <!-- Content column (constrained width) -->
        <div class="min-w-0 max-w-xl flex-1">
            <!-- PROFILE -->
            <div v-if="active === 'profile'" class="space-y-6">
                <div class="rounded-2xl border border-border-default p-6">
                    <h2 class="text-base font-semibold">Profile</h2>
                    <p class="mt-0.5 text-sm text-text-tertiary">
                        Your name and how you appear.
                    </p>

                    <div class="mt-6 space-y-4">
                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <FieldContent>
                                <Input v-model="name" placeholder="Your name" />
                                <FieldError v-if="saveError">{{
                                    saveError
                                }}</FieldError>
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

                        <div class="flex items-center justify-end gap-3 pt-1">
                            <span
                                v-if="savedOk"
                                class="text-xs text-text-tertiary"
                                >Saved</span
                            >
                            <Button
                                size="sm"
                                :disabled="!dirty || saving"
                                @click="saveProfile"
                            >
                                {{ saving ? "Saving…" : "Save changes" }}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PLAN & BILLING -->
            <div v-else-if="active === 'plan'" class="space-y-6">
                <!-- Current plan + usage -->
                <div class="rounded-2xl border border-border-default p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-base font-semibold">
                                Current plan
                            </h2>
                            <p class="mt-0.5 text-sm text-text-tertiary">
                                You're on the {{ isPro ? "Pro" : "Free" }} plan.
                            </p>
                        </div>
                        <span
                            class="rounded-full px-2.5 py-1 text-xs font-medium"
                            :class="
                                isPro
                                    ? 'bg-brand-200 text-text-inverse'
                                    : 'bg-bg-subtle text-text-secondary'
                            "
                        >
                            {{ isPro ? "Pro" : "Free" }}
                        </span>
                    </div>

                    <div v-if="!isPro" class="mt-5 space-y-2">
                        <div
                            class="flex items-center justify-between text-xs text-text-secondary"
                        >
                            <span>AI customizations this month</span>
                            <span>{{ used }} / {{ freeLimit }}</span>
                        </div>
                        <Progress :value="used" :max="freeLimit" />
                    </div>
                    <p v-else class="mt-4 text-sm text-text-secondary">
                        You have unlimited AI customizations.
                    </p>
                </div>

                <!-- Pricing cards (only if on Free) -->
                <div v-if="!isPro" class="grid gap-4 sm:grid-cols-2">
                    <div
                        v-for="tier in PRICING_TIERS"
                        :key="tier.id"
                        class="flex flex-col rounded-2xl border p-5"
                        :class="
                            tier.highlight
                                ? 'border-brand-200 bg-bg-surface'
                                : 'border-border-default'
                        "
                    >
                        <h3 class="text-sm font-semibold">{{ tier.name }}</h3>
                        <div class="mt-1 flex items-baseline gap-1">
                            <span class="text-2xl font-semibold">{{
                                tier.price
                            }}</span>
                            <span class="text-xs text-text-tertiary">{{
                                tier.period
                            }}</span>
                        </div>
                        <ul class="mt-4 flex-1 space-y-2">
                            <li
                                v-for="f in tier.features"
                                :key="f"
                                class="flex items-start gap-2 text-xs"
                                :class="
                                    tier.highlight
                                        ? 'text-text-secondary'
                                        : 'text-text-tertiary'
                                "
                            >
                                <PhCheck
                                    class="mt-0.5 size-3.5 shrink-0"
                                    :class="
                                        tier.highlight
                                            ? 'text-chart-teal'
                                            : 'text-text-tertiary'
                                    "
                                />
                                {{ f }}
                            </li>
                        </ul>
                        <Button
                            v-if="tier.id === 'PRO'"
                            class="mt-5 w-full"
                            disabled
                        >
                            Upgrade (billing soon)
                        </Button>
                        <div
                            v-else
                            class="mt-5 w-full rounded-lg border border-border-default py-1.5 text-center text-xs text-text-tertiary"
                        >
                            Current plan
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
