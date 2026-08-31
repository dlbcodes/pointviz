import type { User } from "@supabase/supabase-js";

export default defineNuxtPlugin(async () => {
	const supabase = useSupabaseClient();
	const userStore = useUserStore();

	// Load the DB profile for a given auth user, guarding against redundant loads
	// by tracking which user we've already hydrated.
	let hydratedUserId: string | null = null;

	const hydrate = async (u: User | null, source: string) => {
		if (u && hydratedUserId === u.id) return; // already loaded this user
		try {
			userStore.setUser(u);
			if (u) {
				await userStore.fetchProfile();
				hydratedUserId = u.id;
			}
		} catch (err) {
			console.error(`Auth init error during ${source}:`, err);
			userStore.clearAll();
			hydratedUserId = null;
		}
	};

	// Startup: hydrate once if a session already exists (page refresh).
	const { data } = await supabase.auth.getSession();
	if (data.session?.user) {
		await hydrate(data.session.user, "startup");
	}

	// React to future auth changes.
	supabase.auth.onAuthStateChange(async (authEvent, session) => {
		if (authEvent === "SIGNED_OUT") {
			userStore.clearAll();
			hydratedUserId = null;
			// No forced redirect — the builder works for anonymous users.
			// signOut() in useAuth handles navigation where it's actually wanted.
		} else if (authEvent === "SIGNED_IN" && session?.user) {
			await hydrate(session.user, "signIn");
		} else if (authEvent === "TOKEN_REFRESHED" && session?.user) {
			userStore.setUser(session.user);
		}
	});
});