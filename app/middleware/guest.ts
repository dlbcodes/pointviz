export default defineNuxtRouteMiddleware(async () => {
	const user = useSupabaseUser();
	// On refresh, user.value may be transiently null before the session restores.
	if (!user.value && import.meta.client) {
		const supabase = useSupabaseClient();
		const { data } = await supabase.auth.getSession();
		if (data.session) return navigateTo("/"); // actually logged in — bounce away
	}
	if (user.value) return navigateTo("/");
});