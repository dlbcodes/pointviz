<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import {
    Panel,
    PanelContent,
    PanelFooter,
    Field,
    FieldLabel,
    FieldContent,
    FieldError,
    FieldDescription,
    Input,
    Button,
} from "@dlbcodes/ui";
import { changePasswordSchema } from "~~/shared/types/auth";

definePageMeta({ layout: "auth", middleware: "guest" });

const supabase = useSupabaseClient();
const { recover, loading, error: authError } = useAuth();

const password = ref("");
const confirm = ref("");
const errors = ref<Record<string, string>>({});
const done = ref(false);

// whether a valid recovery session is present (from the email link)
const validLink = ref(false);
const checking = ref(true);

onMounted(() => {
    // Supabase fires PASSWORD_RECOVERY when it detects the recovery token in the URL
    const { data } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
            validLink.value = true;
            checking.value = false;
        }
    });

    // fallback: if a session already exists shortly after mount, treat as valid
    setTimeout(async () => {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) validLink.value = true;
        checking.value = false;
    }, 800);

    onUnmounted(() => data.subscription.unsubscribe());
});

const onSubmit = async (): Promise<void> => {
    errors.value = {};
    const parsed = changePasswordSchema.safeParse({
        password: password.value,
        confirmPassword: confirm.value,
    });
    if (!parsed.success) {
        for (const issue of parsed.error.issues) {
            errors.value[issue.path[0] as string] = issue.message;
        }
        return;
    }
    const ok = await recover({ password: parsed.data.password });
    if (ok) {
        done.value = true;
        setTimeout(() => navigateTo("/login"), 1500);
    }
};

useHead({ title: "Recover" });
</script>

<template>
    <Panel class="w-full min-w-sm max-w-md">
        <PanelContent class="flex flex-col gap-6 p-8">
            <div>
                <div
                    class="text-2xl font-semibold tracking-tight text-text-primary"
                >
                    Set a new password
                </div>
                <div class="mt-1 text-sm text-text-secondary">
                    Choose a new password for your account.
                </div>
            </div>

            <!-- checking the link -->
            <div v-if="checking" class="text-sm text-text-tertiary">
                Verifying your reset link…
            </div>

            <!-- invalid / expired link -->
            <div v-else-if="!validLink && !done" class="flex flex-col gap-3">
                <p class="text-sm text-danger-text">
                    This reset link is invalid or has expired. Reset links can
                    only be used once.
                </p>
                <Button
                    variant="secondary"
                    class="w-full justify-center"
                    to="/reset"
                >
                    Request a new link
                </Button>
            </div>

            <!-- success -->
            <div v-else-if="done" class="text-sm text-success-text">
                Password updated. Redirecting to sign in…
            </div>

            <!-- the form -->
            <template v-else>
                <p v-if="authError" class="text-sm text-danger-text">
                    {{ authError }}
                </p>

                <Field :invalid="!!errors.password">
                    <FieldLabel>New password</FieldLabel>
                    <FieldContent>
                        <Input
                            v-model="password"
                            type="password"
                            placeholder="••••••••"
                            autocomplete="new-password"
                        />
                        <FieldDescription
                            >At least 8 characters.</FieldDescription
                        >
                        <FieldError v-if="errors.password">{{
                            errors.password
                        }}</FieldError>
                    </FieldContent>
                </Field>

                <Field :invalid="!!errors.confirmPassword">
                    <FieldLabel>Confirm new password</FieldLabel>
                    <FieldContent>
                        <Input
                            v-model="confirm"
                            type="password"
                            placeholder="••••••••"
                            autocomplete="new-password"
                            @keyup.enter="onSubmit"
                        />
                        <FieldError v-if="errors.confirmPassword">{{
                            errors.confirmPassword
                        }}</FieldError>
                    </FieldContent>
                </Field>

                <Button
                    variant="primary"
                    class="w-full justify-center"
                    :disabled="loading"
                    @click="onSubmit"
                >
                    {{ loading ? "Updating…" : "Update password" }}
                </Button>
            </template>
        </PanelContent>

        <PanelFooter class="justify-center py-4">
            <div class="text-sm text-text-secondary">
                <NuxtLink to="/login" class="font-medium text-brand-200"
                    >Back to sign in</NuxtLink
                >
            </div>
        </PanelFooter>
    </Panel>
</template>
