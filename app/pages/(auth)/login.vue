<script setup lang="ts">
import { ref, computed } from "vue";
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
import { loginSchema } from "~~/shared/types/auth";

definePageMeta({ layout: "auth", middleware: "guest" });

useSeoMeta({
    title: "Log in",
    description: "Log in to your PointViz account.",
    robots: "noindex, nofollow",
});

const { login, loading, error: authError } = useAuth();
const route = useRoute();

const email = ref("");
const password = ref("");
const errors = ref<Record<string, string>>({});

// where to go after login: the ?redirect= param, else home
const redirectTo = computed(() => {
    const r = route.query.redirect;
    const target = Array.isArray(r) ? r[0] : r;
    return target && target.startsWith("/") ? target : "/";
});

const onSubmit = async (): Promise<void> => {
    errors.value = {};
    const parsed = loginSchema.safeParse({
        email: email.value,
        password: password.value,
    });
    if (!parsed.success) {
        for (const issue of parsed.error.issues) {
            errors.value[issue.path[0] as string] = issue.message;
        }
        return;
    }
    const ok = await login(parsed.data);
    if (ok) {
        await navigateTo(redirectTo.value);
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
                    Welcome back
                </div>
                <div class="mt-1 text-sm text-text-secondary">
                    Sign in to your account to continue.
                </div>
            </div>

            <p v-if="authError" class="text-sm text-danger-text">
                {{ authError }}
            </p>

            <div class="flex flex-col gap-4">
                <Field :invalid="!!errors.email">
                    <FieldLabel>Email</FieldLabel>
                    <FieldContent>
                        <Input
                            v-model="email"
                            type="email"
                            placeholder="you@example.com"
                            @keyup.enter="onSubmit"
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

                <div class="flex items-center justify-end">
                    <NuxtLink
                        to="/forgot-password"
                        class="text-sm text-brand-200"
                    >
                        Forgot password?
                    </NuxtLink>
                </div>

                <Button
                    variant="primary"
                    class="w-full justify-center"
                    :disabled="loading"
                    @click="onSubmit"
                >
                    {{ loading ? "Signing in…" : "Sign in" }}
                </Button>
            </div>
        </PanelContent>

        <PanelFooter class="justify-center py-4">
            <div class="text-sm text-text-secondary">
                Don't have an account?
                <NuxtLink to="/signup" class="font-medium text-brand-200"
                    >Sign up</NuxtLink
                >
            </div>
        </PanelFooter>
    </Panel>
</template>
