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
    Input,
    Button,
} from "@dlbcodes/ui";
import { registerSchema } from "~~/shared/types/auth";

definePageMeta({ layout: "auth", middleware: "guest" });

useSeoMeta({
    title: "Sign up",
    description: "Create a PointViz account.",
    robots: "noindex, nofollow",
});

const { register, loading, error: authError } = useAuth();

const name = ref("");
const email = ref("");
const password = ref("");
const errors = ref<Record<string, string>>({});

const onSubmit = async (): Promise<void> => {
    errors.value = {};

    const parsed = registerSchema.safeParse({
        name: name.value,
        email: email.value,
        password: password.value,
    });
    if (!parsed.success) {
        for (const issue of parsed.error.issues) {
            errors.value[issue.path[0] as string] = issue.message;
        }
        return;
    }

    const ok = await register(parsed.data);
    if (ok) {
        // If email confirmation is ON, send them to a "check your email" page.
        // If it's OFF (auto-login on signup), send them straight to the builder.
        await navigateTo("/");
    }
};
</script>

<template>
    <Panel class="w-full">
        <PanelContent class="flex flex-col gap-6 p-8">
            <div>
                <div
                    class="text-2xl font-semibold tracking-tight text-text-primary"
                >
                    Create your account
                </div>
                <div class="mt-1 text-sm text-text-secondary">
                    Build and customize charts with natural language.
                </div>
            </div>

            <p v-if="authError" class="text-sm text-danger-text">
                {{ authError }}
            </p>

            <div class="flex flex-col gap-4">
                <Field :invalid="!!errors.name">
                    <FieldLabel>Name</FieldLabel>
                    <FieldContent>
                        <Input
                            v-model="name"
                            type="text"
                            placeholder="John Doe"
                        />
                        <FieldError v-if="errors.name">{{
                            errors.name
                        }}</FieldError>
                    </FieldContent>
                </Field>

                <Field :invalid="!!errors.email">
                    <FieldLabel>Email</FieldLabel>
                    <FieldContent>
                        <Input
                            v-model="email"
                            type="email"
                            placeholder="you@example.com"
                        />
                        <FieldError v-if="errors.email">{{
                            errors.email
                        }}</FieldError>
                    </FieldContent>
                </Field>

                <Field :invalid="!!errors.password">
                    <FieldLabel>Password</FieldLabel>
                    <FieldContent>
                        <Input
                            v-model="password"
                            type="password"
                            placeholder="••••••••"
                            @keyup.enter="onSubmit"
                        />
                        <FieldError v-if="errors.password">{{
                            errors.password
                        }}</FieldError>
                    </FieldContent>
                </Field>

                <Button
                    variant="primary"
                    class="w-full justify-center"
                    :disabled="loading"
                    @click="onSubmit"
                >
                    {{ loading ? "Creating account…" : "Create account" }}
                </Button>
            </div>
        </PanelContent>

        <PanelFooter class="justify-center py-4">
            <div class="text-sm text-text-secondary">
                Already have an account?
                <NuxtLink to="/login" class="font-medium text-brand-200"
                    >Sign in</NuxtLink
                >
            </div>
        </PanelFooter>
    </Panel>
</template>
