<!-- app/components/DeleteChartModal.vue -->
<script setup lang="ts">
import { ref, watch } from "vue";
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

const props = defineProps<{ chartName?: string | null }>();
const emit = defineEmits<{ confirm: [] }>();

const deleting = ref(false);

function onConfirm() {
    deleting.value = true;
    emit("confirm");
    // parent closes the modal once the delete resolves
}

watch(open, (isOpen) => {
    if (!isOpen) deleting.value = false;
});
</script>

<template>
    <Modal v-model="open" size="md">
        <ModalHeader>
            <ModalTitle>Delete this chart?</ModalTitle>
            <ModalDescription>This can't be undone.</ModalDescription>
            <ModalClose />
        </ModalHeader>

        <ModalContent>
            <p class="text-sm leading-relaxed text-text-secondary">
                <span v-if="chartName" class="font-medium text-text-primary"
                    >"{{ chartName }}"</span
                ><span v-else>This chart</span> will be permanently deleted. Any
                public links or embeds pointing to it will stop working.
            </p>
        </ModalContent>

        <ModalFooter>
            <Button
                variant="secondary"
                :disabled="deleting"
                @click="open = false"
                >Cancel</Button
            >
            <Button
                variant="destructive"
                :disabled="deleting"
                @click="onConfirm"
            >
                {{ deleting ? "Deleting…" : "Delete chart" }}
            </Button>
        </ModalFooter>
    </Modal>
</template>
