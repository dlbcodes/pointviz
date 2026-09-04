<script setup lang="ts">
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalContent,
    ModalFooter,
    ModalClose,
    Kbd,
    KbdGroup,
} from "@dlbcodes/ui";

const open = defineModel<boolean>("open", { required: true });

const shortcuts = [
    { action: "Command palette", keys: ["⌘", "K"] },
    { action: "New chat", keys: ["⌘", "⇧", "O"] },
    { action: "Toggle sidebar", keys: ["⌘", "B"] },
    { action: "Go to settings", keys: ["⌘", ","] },
    { action: "Get help", keys: ["⌘", "J"] },
    { action: "Keyboard shortcuts", keys: ["?"] },
    { action: "Send message", keys: ["⏎"] },
    { action: "New line", keys: ["⇧", "⏎"] },
];
</script>

<template>
    <Modal v-model="open" size="md">
        <ModalHeader>
            <ModalTitle>Keyboard shortcuts</ModalTitle>
            <ModalDescription>
                Move faster with these shortcuts.
            </ModalDescription>
            <ModalClose />
        </ModalHeader>
        <ModalContent>
            <div class="flex flex-col">
                <div
                    v-for="s in shortcuts"
                    :key="s.action"
                    class="flex items-center justify-between border-b border-border-subtle py-2.5 last:border-b-0"
                >
                    <span class="text-sm text-text-secondary">
                        {{ s.action }}
                    </span>
                    <KbdGroup>
                        <Kbd v-for="k in s.keys" :key="k">{{ k }}</Kbd>
                    </KbdGroup>
                </div>
            </div>
        </ModalContent>
        <ModalFooter
            class="justify-start gap-1 border-t border-border-subtle font-mono text-xs tracking-tight text-text-tertiary"
        >
            Press <Kbd>esc</Kbd> to close
        </ModalFooter>
    </Modal>
</template>
