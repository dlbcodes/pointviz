<script setup lang="ts">
import {
    Dropdown,
    DropdownTrigger,
    DropdownContent,
    DropdownItem,
    Avatar,
    Kbd,
    KbdGroup,
    Separator,
} from "@dlbcodes/ui";
import {
    PhSquaresFour,
    PhGear,
    PhKeyboard,
    PhQuestion,
    PhSignOut,
    PhMicrophoneStage,
} from "@phosphor-icons/vue";

const router = useRouter();
const userStore = useUserStore();
const { signOut } = useAuth();

const emit = defineEmits<{
    "open-shortcuts": [];
    "open-help": [];
    "open-feedback": [];
}>();

const displayName = computed(() => userStore.displayName);
const displayEmail = computed(
    () => userStore.profile?.email ?? userStore.authUser?.email ?? "",
);
const avatarUrl = computed(
    () =>
        userStore.profile?.avatarUrl ??
        (userStore.authUser?.user_metadata?.avatar_url as string) ??
        null,
);

const go = (to: string): void => {
    router.push(to);
};

const openShortcuts = (): void => {
    emit("open-shortcuts");
};
const openHelp = (): void => {
    emit("open-help");
};
const openFeedback = (): void => {
    emit("open-feedback");
};

const logout = async (): Promise<void> => {
    await signOut();
};
</script>

<template>
    <Dropdown placement="bottom-end">
        <DropdownTrigger
            v-slot="{ open }"
            class="rounded-full outline-none transition-opacity hover:opacity-80"
        >
            <Avatar
                :name="displayName"
                :src="avatarUrl"
                size="sm"
                class="ring-2 ring-transparent transition-shadow"
                :class="open ? 'ring-border-subtle' : ''"
            />
        </DropdownTrigger>

        <DropdownContent size="2xs" class="p-1">
            <!-- profile header -->
            <div class="flex items-center gap-2.5 px-2 py-2">
                <Avatar :name="displayName" :src="avatarUrl" size="sm" />
                <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-text-primary">
                        {{ displayName }}
                    </p>
                    <p class="truncate text-xs text-text-tertiary">
                        {{ displayEmail }}
                    </p>
                </div>
            </div>

            <Separator class="my-1" />

            <!-- primary actions -->
            <DropdownItem @click="go('/charts')">
                <PhSquaresFour
                    class="size-4 text-text-tertiary"
                    aria-hidden="true"
                />
                Overview
            </DropdownItem>
            <DropdownItem @click="go('/account')" class="justify-between">
                <span class="flex items-center gap-2">
                    <PhGear
                        class="size-4 text-text-tertiary"
                        aria-hidden="true"
                    />
                    Account settings
                </span>
                <KbdGroup><Kbd>⌘</Kbd><Kbd>,</Kbd></KbdGroup>
            </DropdownItem>

            <Separator class="my-1" />

            <!-- secondary / help -->
            <DropdownItem @click="openShortcuts" class="justify-between">
                <span class="flex items-center gap-2">
                    <PhKeyboard
                        class="size-4 text-text-tertiary"
                        aria-hidden="true"
                    />
                    Keyboard shortcuts
                </span>
                <KbdGroup><Kbd>?</Kbd></KbdGroup>
            </DropdownItem>
            <DropdownItem @click="openHelp" class="justify-between">
                <span class="flex items-center gap-2">
                    <PhQuestion
                        class="size-4 text-text-tertiary"
                        aria-hidden="true"
                    />
                    Get help
                </span>
                <KbdGroup><Kbd>⌘</Kbd><Kbd>J</Kbd></KbdGroup>
            </DropdownItem>
            <DropdownItem @click="openFeedback" class="justify-between">
                <span class="flex items-center gap-2">
                    <PhMicrophoneStage
                        class="size-4 text-text-tertiary"
                        aria-hidden="true"
                    />
                    Send feedback
                </span>
                <KbdGroup><Kbd>⌘</Kbd><Kbd>J</Kbd></KbdGroup>
            </DropdownItem>

            <Separator class="my-1" />

            <!-- sign out — visually distinct -->
            <DropdownItem
                @click="logout"
                class="text-text-secondary hover:text-text-primary"
            >
                <PhSignOut
                    class="size-4 text-text-tertiary"
                    aria-hidden="true"
                />
                Log out
            </DropdownItem>
        </DropdownContent>
    </Dropdown>
</template>
