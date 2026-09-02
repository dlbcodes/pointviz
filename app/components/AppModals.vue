<!-- app/components/AppModals.vue -->
<script setup lang="ts">
// One home for all app-global modals. Mount once per layout that needs them.
const authModalOpen = useState("auth-modal-open", () => false);
const upgradeModalOpen = useState("upgrade-modal-open", () => false);
const feedbackModalOpen = useState("feedback-modal-open", () => false);
const helpModalOpen = useState("help-modal-open", () => false);
const shortcutsModalOpen = useState("shortcuts-modal-open", () => false);
</script>

<template>
    <AuthModal v-model:open="authModalOpen" />
    <UpgradeModal v-model:open="upgradeModalOpen" />
    <FeedbackModal v-model:open="feedbackModalOpen" />
    <HelpModal v-model:open="helpModalOpen" />
    <ShortcutsModal v-model:open="shortcutsModalOpen" />
</template>
