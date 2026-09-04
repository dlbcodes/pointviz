<script setup lang="ts">
import { computed } from "vue";
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
    PhCaretUpDown,
} from "@phosphor-icons/vue";

const props = withDefaults(
    defineProps<{
        variant?: "full" | "avatar";
    }>(),
    { variant: "full" },
);

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

const go = (to: string) => router.push(to);
const logout = async () => {
    await signOut();
};
</script>

<template>
    <Dropdown
        :placement="props.variant === 'avatar' ? 'bottom-end' : 'top-end'"
        class="w-full"
    >
        <!-- Full row: avatar + name + email + chevron -->
        <DropdownTrigger
            v-if="props.variant === 'full'"
            v-slot="{ open }"
            class="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left outline-none transition-colors hover:bg-bg-subtle"
        >
            <Avatar :name="displayName" :src="avatarUrl" size="sm" />
            <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-text-primary">
                    {{ displayName }}
                </p>
                <p class="truncate text-xs text-text-tertiary">
                    {{ displayEmail }}
                </p>
            </div>
            <PhCaretUpDown
                class="size-4 shrink-0 text-text-tertiary transition-colors"
                :class="open ? 'text-text-secondary' : ''"
                aria-hidden="true"
            />
        </DropdownTrigger>

        <!-- Avatar only -->
        <DropdownTrigger
            v-else
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
            <!-- profile header inside the popover -->
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

            <DropdownItem
                @click="emit('open-shortcuts')"
                class="justify-between"
            >
                <span class="flex items-center gap-2">
                    <PhKeyboard
                        class="size-4 text-text-tertiary"
                        aria-hidden="true"
                    />
                    Keyboard shortcuts
                </span>
                <KbdGroup><Kbd>?</Kbd></KbdGroup>
            </DropdownItem>
            <DropdownItem @click="emit('open-help')" class="justify-between">
                <span class="flex items-center gap-2">
                    <PhQuestion
                        class="size-4 text-text-tertiary"
                        aria-hidden="true"
                    />
                    Get help
                </span>
            </DropdownItem>
            <DropdownItem
                @click="emit('open-feedback')"
                class="justify-between"
            >
                <span class="flex items-center gap-2">
                    <PhMicrophoneStage
                        class="size-4 text-text-tertiary"
                        aria-hidden="true"
                    />
                    Send feedback
                </span>
            </DropdownItem>

            <Separator class="my-1" />

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
