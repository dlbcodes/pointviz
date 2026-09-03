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

const open = defineModel<boolean>("open", { required: true });

const props = defineProps<{
    templateName?: string;
}>();

const emit = defineEmits<{
    confirm: [];
}>();

const deleting = ref(false);

async function onConfirm() {
    deleting.value = true;
    emit("confirm");
    // parent closes the modal after the delete resolves;
    // we reset the local flag when the modal closes
}

watch(open, (isOpen) => {
    if (!isOpen) deleting.value = false;
});
</script>

<template>
    <Modal v-model="open" size="md">
        <ModalHeader>
            <ModalTitle>Delete this template?</ModalTitle>
            <ModalDescription>This action can't be undone.</ModalDescription>
            <ModalClose />
        </ModalHeader>

        <ModalContent>
            <p class="text-sm leading-relaxed text-text-secondary">
                <span v-if="templateName" class="font-medium text-text-primary"
                    >"{{ templateName }}"</span
                ><span v-else>This template</span> will be permanently removed,
                and anyone connected to it via MCP will lose access.
            </p>
        </ModalContent>

        <ModalFooter>
            <Button
                variant="secondary"
                :disabled="deleting"
                @click="open = false"
            >
                Cancel
            </Button>
            <Button
                variant="destructive"
                :disabled="deleting"
                @click="onConfirm"
            >
                {{ deleting ? "Deleting…" : "Delete template" }}
            </Button>
        </ModalFooter>
    </Modal>
</template>
