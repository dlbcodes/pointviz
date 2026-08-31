<script setup lang="ts">
import { ref } from "vue";
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
import { resetSchema } from "~~/shared/types/auth";

definePageMeta({ layout: "auth", middleware: "guest" });

const { forgot, loading, error: authError } = useAuth();

const email = ref("");
const errors = ref<Record<string, string>>({});
const done = ref(false);

const onSubmit = async (): Promise<void> => {
    errors.value = {};
    const parsed = resetSchema.safeParse({ email: email.value });
    if (!parsed.success) {
        for (const issue of parsed.error.issues) {
            errors.value[issue.path[0] as string] = issue.message;
        }
        return;
    }
    const ok = await forgot(parsed.data);
    if (ok) done.value = true;
};

useHead({ title: "Forgot password" });
</script>

<template>
    <Panel class="w-full min-w-sm max-w-md">
        <PanelContent class="flex flex-col gap-6 p-8">
            <div>
                <div
                    class="text-2xl font-semibold tracking-tight text-text-primary"
                >
                    Reset your password
                </div>
                <div class="mt-1 text-sm text-text-secondary">
                    Enter your email and we'll send you a link to reset it.
                </div>
            </div>

            <!-- done state: email sent -->
            <div v-if="done" class="text-sm text-success-text">
                Check your inbox — if an account exists for {{ email }}, a reset
                link is on its way.
            </div>

            <template v-else>
                <p v-if="authError" class="text-sm text-danger-text">
                    {{ authError }}
                </p>

                <Field :invalid="!!errors.email">
                    <FieldLabel>Email</FieldLabel>
                    <FieldContent>
                        <Input
                            v-model="email"
                            type="email"
                            placeholder="you@example.com"
                            autocomplete="email"
                            @keyup.enter="onSubmit"
                        />
                        <FieldError v-if="errors.email">{{
                            errors.email
                        }}</FieldError>
                    </FieldContent>
                </Field>

                <Button
                    variant="primary"
                    class="w-full justify-center"
                    :disabled="loading"
                    @click="onSubmit"
                >
                    {{ loading ? "Sending…" : "Send reset link" }}
                </Button>
            </template>
        </PanelContent>

        <PanelFooter class="justify-center py-4">
            <div class="text-sm text-text-secondary">
                <NuxtLink to="/login" class="font-medium text-brand-200">
                    Back to sign in
                </NuxtLink>
            </div>
        </PanelFooter>
    </Panel>
</template>
