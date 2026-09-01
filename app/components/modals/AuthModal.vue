<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalContent,
    ModalFooter,
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

// Single destructure — includes loginWithGoogle
const {
    login,
    register,
    loginWithGoogle,
    loading,
    error: authError,
} = useAuth();
const { rawInput } = useChartSpec(); // to stash the in-progress chart before the OAuth redirect

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
    // Stash the chart so it survives the redirect to Google and back.
    if (import.meta.client) {
        sessionStorage.setItem("pointviz:pending-spec", rawInput.value);
    }
    googleLoading.value = true;
    const ok = await loginWithGoogle("/");
    if (!ok) {
        googleLoading.value = false; // stayed on page (error); else the browser is redirecting
        sessionStorage.removeItem("pointviz:pending-spec"); // no redirect happening, clean up
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
        <ModalHeader>
            <ModalTitle>
                {{
                    mode === "register"
                        ? "Create an account to customize"
                        : "Welcome back"
                }}
            </ModalTitle>
            <ModalDescription>
                Sign up to customize charts with natural language. Your chart
                stays right here.
            </ModalDescription>
            <ModalClose />
        </ModalHeader>

        <ModalContent>
            <div class="flex flex-col gap-4">
                <p v-if="authError" class="text-sm text-danger-text">
                    {{ authError }}
                </p>

                <!-- Google (the smooth path) -->
                <Button
                    variant="secondary"
                    class="w-full justify-center gap-2"
                    :disabled="googleLoading"
                    @click="onGoogle"
                >
                    <GoogleLogo />
                    <!-- your Google logo component/svg here -->
                    {{
                        googleLoading ? "Redirecting…" : "Continue with Google"
                    }}
                </Button>

                <!-- divider -->
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <span
                            class="w-full border-t border-border-subtle"
                        ></span>
                    </div>
                    <div class="relative flex justify-center">
                        <span
                            class="bg-bg-surface px-3 font-mono text-xs text-text-tertiary"
                            >or</span
                        >
                    </div>
                </div>

                <!-- email/password (the inclusive fallback, preserves chart inline) -->
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

                <button
                    type="button"
                    class="text-left text-sm text-text-secondary hover:text-text-primary"
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

        <ModalFooter>
            <Button variant="secondary" @click="open = false">Cancel</Button>
            <Button :disabled="loading" @click="submit">
                {{
                    loading
                        ? "Please wait…"
                        : mode === "register"
                          ? "Create account"
                          : "Sign in"
                }}
            </Button>
        </ModalFooter>
    </Modal>
</template>
