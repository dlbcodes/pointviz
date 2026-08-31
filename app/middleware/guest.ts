export default defineNuxtRouteMiddleware(() => {
	const user = useSupabaseUser();
	console.log("[guest] user:", user.value?.id ?? null);
	if (user.value) {
		return navigateTo("/");
	}
});