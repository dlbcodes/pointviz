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
    Textarea,
    Button,
} from "@dlbcodes/ui";
import { PhStar, PhCheckCircle } from "@phosphor-icons/vue";
import { messageApiService } from "~/services/MessageApiService";
import { feedbackInputSchema } from "~~/shared/types/message";

const open = defineModel<boolean>("open", { required: true });

const rating = ref(0);
const message = ref("");
const submitting = ref(false);
const submitted = ref(false);
const error = ref("");
const messageRef = ref();

watch(open, async (isOpen) => {
    if (!isOpen) {
        setTimeout(() => {
            rating.value = 0;
            message.value = "";
            submitted.value = false;
            error.value = "";
        }, 200);
        return;
    }
    await nextTick();
    const el = messageRef.value?.$el ?? messageRef.value;
    (el?.querySelector?.("textarea") ?? el)?.focus?.();
});

async function submit() {
    const parsed = feedbackInputSchema.safeParse({
        kind: "feedback",
        message: message.value.trim(),
        rating: rating.value || undefined,
    });
    if (!parsed.success) {
        error.value =
            parsed.error.issues[0]?.message ?? "Please check the form.";
        return;
    }

    submitting.value = true;
    error.value = "";
    try {
        await messageApiService.sendFeedback(
            parsed.data.message,
            parsed.data.rating,
        );
        submitted.value = true;
    } catch (e: any) {
        error.value = e.message ?? "Couldn't send feedback.";
    } finally {
        submitting.value = false;
    }
}
</script>

<template>
    <Modal v-model="open" size="md">
        <!-- success -->
        <template v-if="submitted">
            <ModalHeader>
                <ModalTitle>Thank you</ModalTitle>
                <ModalClose />
            </ModalHeader>
            <ModalContent>
                <div class="flex flex-col items-center gap-3 py-6 text-center">
                    <PhCheckCircle
                        class="size-10 text-brand-200"
                        weight="fill"
                    />
                    <p class="text-sm text-text-secondary">
                        Your feedback helps shape what we build next.
                    </p>
                </div>
            </ModalContent>
            <ModalFooter>
                <Button variant="secondary" @click="open = false">Close</Button>
            </ModalFooter>
        </template>

        <!-- form -->
        <template v-else>
            <ModalHeader>
                <ModalTitle>Share feedback</ModalTitle>
                <ModalDescription>
                    How's it going? Tell us what you love or what's missing.
                </ModalDescription>
                <ModalClose />
            </ModalHeader>
            <ModalContent>
                <div class="flex flex-col gap-4">
                    <!-- rating -->
                    <Field>
                        <FieldLabel
                            >How would you rate your experience?</FieldLabel
                        >
                        <FieldContent>
                            <div class="flex gap-1">
                                <button
                                    v-for="n in 5"
                                    :key="n"
                                    type="button"
                                    class="rounded-md p-1 transition-transform hover:scale-110"
                                    :aria-label="`${n} star${n > 1 ? 's' : ''}`"
                                    @click="rating = n"
                                >
                                    <PhStar
                                        class="size-7 transition-colors"
                                        :class="
                                            n <= rating
                                                ? 'text-accent-pro-200'
                                                : 'text-border-dark'
                                        "
                                        :weight="
                                            n <= rating ? 'fill' : 'regular'
                                        "
                                    />
                                </button>
                            </div>
                        </FieldContent>
                    </Field>

                    <!-- comment -->
                    <Field required>
                        <FieldLabel>Your feedback</FieldLabel>
                        <FieldContent>
                            <Textarea
                                ref="messageRef"
                                v-model="message"
                                :rows="4"
                                autosize
                                placeholder="What's working, what's not, what you'd love to see…"
                            />
                        </FieldContent>
                    </Field>

                    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
                </div>
            </ModalContent>
            <ModalFooter>
                <Button variant="secondary" @click="open = false"
                    >Cancel</Button
                >
                <Button
                    :disabled="!message.trim() || submitting"
                    @click="submit"
                >
                    {{ submitting ? "Sending…" : "Send feedback" }}
                </Button>
            </ModalFooter>
        </template>
    </Modal>
</template>
