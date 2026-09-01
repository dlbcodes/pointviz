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
    Input,
    Textarea,
    Button,
} from "@dlbcodes/ui";
import { PhCheckCircle } from "@phosphor-icons/vue";
import { messageApiService } from "~/services/MessageApiService";
import { helpInputSchema } from "~~/shared/types/message";

const open = defineModel<boolean>("open", { required: true });

const subject = ref("");
const message = ref("");
const submitting = ref(false);
const submitted = ref(false);
const error = ref("");
const subjectRef = ref();

watch(open, async (isOpen) => {
    if (!isOpen) {
        setTimeout(() => {
            subject.value = "";
            message.value = "";
            submitted.value = false;
            error.value = "";
        }, 200);
        return;
    }
    await nextTick();
    const el = subjectRef.value?.$el ?? subjectRef.value;
    (el?.querySelector?.("input") ?? el)?.focus?.();
});

async function sendHelp() {
    const parsed = helpInputSchema.safeParse({
        kind: "help",
        subject: subject.value.trim(),
        message: message.value.trim(),
    });
    if (!parsed.success) {
        error.value =
            parsed.error.issues[0]?.message ?? "Please check the form.";
        return;
    }

    submitting.value = true;
    error.value = "";
    try {
        await messageApiService.sendHelp(
            parsed.data.subject,
            parsed.data.message,
        );
        submitted.value = true;
    } catch (e: any) {
        error.value = e.message ?? "Couldn't send message.";
    } finally {
        submitting.value = false;
    }
}
</script>

<template>
    <Modal v-model="open" size="md">
        <template v-if="submitted">
            <ModalHeader>
                <ModalTitle>Message sent</ModalTitle>
                <ModalClose />
            </ModalHeader>
            <ModalContent>
                <div class="flex flex-col items-center gap-3 py-6 text-center">
                    <PhCheckCircle
                        class="size-10 text-brand-200"
                        weight="fill"
                    />
                    <p class="text-sm text-text-secondary">
                        We'll get back to you soon.
                    </p>
                </div>
            </ModalContent>
            <ModalFooter>
                <Button variant="secondary" @click="open = false">Close</Button>
            </ModalFooter>
        </template>

        <template v-else>
            <ModalHeader>
                <ModalTitle>Get help</ModalTitle>
                <ModalDescription>
                    Have a question or need a hand? Send us a message and we'll
                    get back to you.
                </ModalDescription>
                <ModalClose />
            </ModalHeader>
            <ModalContent>
                <div class="flex flex-col gap-4">
                    <Field required>
                        <FieldLabel>Subject</FieldLabel>
                        <FieldContent>
                            <Input
                                ref="subjectRef"
                                v-model="subject"
                                placeholder="What's this about?"
                            />
                        </FieldContent>
                    </Field>
                    <Field required>
                        <FieldLabel>Message</FieldLabel>
                        <FieldContent>
                            <Textarea
                                v-model="message"
                                placeholder="Tell us what's going on…"
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
                    :disabled="!subject.trim() || !message.trim() || submitting"
                    @click="sendHelp"
                >
                    {{ submitting ? "Sending…" : "Send message" }}
                </Button>
            </ModalFooter>
        </template>
    </Modal>
</template>
