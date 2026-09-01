<!-- app/components/UpgradeModal.vue -->
<script setup lang="ts">
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalContent,
    ModalFooter,
    ModalClose,
    Button,
} from "@dlbcodes/ui";
import { PhSparkle } from "@phosphor-icons/vue";

const open = defineModel<boolean>("open", { required: true });
</script>

<template>
    <Modal v-model="open" size="md">
        <ModalHeader>
            <ModalTitle>You've hit your free limit</ModalTitle>
            <ModalDescription>
                You've used all your free customizations for today.
            </ModalDescription>
            <ModalClose />
        </ModalHeader>

        <ModalContent>
            <div class="flex flex-col items-center gap-3 py-6 text-center">
                <div
                    class="flex size-12 items-center justify-center rounded-full bg-bg-subtle"
                >
                    <PhSparkle class="size-6 text-brand-200" weight="fill" />
                </div>
                <p class="text-sm text-text-secondary">
                    A PRO plan with unlimited customizations is coming soon.
                    Your free limit resets in 24 hours.
                </p>
            </div>
        </ModalContent>

        <ModalFooter>
            <Button variant="secondary" @click="open = false">Got it</Button>
            <Button disabled>Upgrade to PRO (soon)</Button>
        </ModalFooter>
    </Modal>
</template>
