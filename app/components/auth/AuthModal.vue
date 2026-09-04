<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import {
    Modal,
    ModalContent,
    ModalClose,
    Field,
    FieldLabel,
    FieldContent,
    FieldError,
    Input,
    Button,
} from "@dlbcodes/ui";
import { loginSchema, registerSchema } from "~~/shared/types/auth";

const open = defineModel<boolean>("open", { required: true });

const {
    login,
    register,
    loginWithGoogle,
    loading,
    error: authError,
} = useAuth();
const { rawInput } = useChartSpec();

type Mode = "login" | "register";
const mode = ref<Mode>("register");

const name = ref("");
const email = ref("");
const password = ref("");
const errors = ref<Record<string, string>>({});
const emailRef = ref();
const googleLoading = ref(false);

watch(open, async (isOpen) => {
    if (!isOpen) {
        setTimeout(() => {
            name.value = "";
            email.value = "";
            password.value = "";
            errors.value = {};
        }, 200);
        return;
    }
    await nextTick();
    const el = emailRef.value?.$el ?? emailRef.value;
    (el?.querySelector?.("input") ?? el)?.focus?.();
});

async function onGoogle() {
    if (import.meta.client) {
        sessionStorage.setItem("pointviz:pending-spec", rawInput.value);
    }
    googleLoading.value = true;
    const ok = await loginWithGoogle("/");
    if (!ok) {
        googleLoading.value = false;
        sessionStorage.removeItem("pointviz:pending-spec");
    }
}

async function submit() {
    errors.value = {};
    if (mode.value === "register") {
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
        if (ok) open.value = false;
    } else {
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
        if (ok) open.value = false;
    }
}
</script>

<template>
    <Modal v-model="open" size="md">
        <ModalContent class="p-8">
            <ModalClose class="absolute right-4 top-4" />

            <!-- Centered header -->
            <div class="mb-6 flex flex-col items-center text-center">
                <BrandMark class="mb-3" />
                <h2 class="text-lg font-semibold tracking-tight">
                    {{
                        mode === "register"
                            ? "Create your account"
                            : "Welcome back"
                    }}
                </h2>
                <p
                    class="mt-1 max-w-xs text-sm text-text-secondary text-balance"
                >
                    {{
                        mode === "register"
                            ? "Sign up to customize charts with AI. Your chart stays right here."
                            : "Sign in to keep customizing."
                    }}
                </p>
            </div>

            <div class="flex flex-col gap-4">
                <p
                    v-if="authError"
                    class="text-center text-sm text-danger-text"
                >
                    {{ authError }}
                </p>

                <!-- Google -->
                <Button
                    variant="secondary"
                    class="w-full justify-center gap-2"
                    :disabled="googleLoading"
                    @click="onGoogle"
                >
                    <GoogleLogo />
                    {{
                        googleLoading ? "Redirecting…" : "Continue with Google"
                    }}
                </Button>

                <!-- divider -->
                <div class="flex items-center gap-3">
                    <span class="h-px flex-1 bg-border-default" />
                    <span class="font-mono text-xs text-text-tertiary">or</span>
                    <span class="h-px flex-1 bg-border-default" />
                </div>

                <!-- email/password -->
                <Field v-if="mode === 'register'" :invalid="!!errors.name">
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
                            ref="emailRef"
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
                            @keyup.enter="submit"
                        />
                        <FieldError v-if="errors.password">{{
                            errors.password
                        }}</FieldError>
                    </FieldContent>
                </Field>

                <!-- Primary action inline (no footer) -->
                <Button class="w-full" :disabled="loading" @click="submit">
                    {{
                        loading
                            ? "Please wait…"
                            : mode === "register"
                              ? "Create account"
                              : "Sign in"
                    }}
                </Button>

                <!-- Mode toggle, centered -->
                <button
                    type="button"
                    class="text-center text-sm text-text-secondary hover:text-text-primary"
                    @click="mode = mode === 'register' ? 'login' : 'register'"
                >
                    {{
                        mode === "register"
                            ? "Already have an account? Sign in"
                            : "Need an account? Sign up"
                    }}
                </button>
            </div>
        </ModalContent>
    </Modal>
</template>
