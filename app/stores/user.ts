// app/stores/user.ts
import { defineStore } from "pinia";
import type { User } from "@supabase/supabase-js";
import type { Me, UpdateMeInput } from "~~/shared/types/user";
import { userApiService } from "~/services/UserApiService";

export const useUserStore = defineStore("user", () => {
	const authUser = ref<User | null>(null);
	const profile = ref<Me | null>(null);

	// display helpers — prefer DB profile, fall back to auth metadata
	const displayName = computed(
		() =>
			profile.value?.name ??
			(authUser.value?.user_metadata?.name as string) ??
			authUser.value?.email?.split("@")[0] ??
			"User",
	);

	const setUser = (user: User | null) => {
		authUser.value = user;
	};

	const fetchProfile = async () => {
		if (!authUser.value) return;
		try {
			profile.value = await userApiService.get();
		} catch (e) {
			console.error("Failed to fetch profile:", e);
		}
	};

	const updateProfile = async (input: UpdateMeInput): Promise<Me> => {
		const updated = await userApiService.update(input);
		profile.value = updated; // store is the source of truth for the UI
		return updated;
	};

	const clearAll = () => {
		authUser.value = null;
		profile.value = null;
	};

	return {
		authUser,
		profile,
		displayName,
		setUser,
		fetchProfile,
		updateProfile,
		clearAll,
	};
});