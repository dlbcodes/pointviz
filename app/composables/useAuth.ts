import type {
	LoginSchemaType,
	RegisterSchemaType,
	ResetSchemaType,
	RecoverSchemaType,
} from "~~/shared/types/auth";

export const useAuth = () => {
	const supabase = useSupabaseClient();
	const user = useSupabaseUser();
	const userStore = useUserStore();
	const { origin } = useRequestURL();

	const error = ref<string | null>(null);
	const loading = ref(false);

	const login = async (params: LoginSchemaType): Promise<boolean> => {
		loading.value = true;
		error.value = null;
		try {
			const { data, error: authError } = await supabase.auth.signInWithPassword({
				email: params.email,
				password: params.password,
			});
			if (authError) {
				error.value = authError.message;
				return false;
			}
			userStore.setUser(data.user);
			return true;
		} catch {
			error.value = "Login failed.";
			return false;
		} finally {
			loading.value = false;
		}
	};

	// add to useAuth, and to the returned object
	const loginWithGoogle = async (redirectPath = "/"): Promise<boolean> => {
		error.value = null;
		try {
			const { error: authError } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${origin}/confirm?redirect=${encodeURIComponent(redirectPath)}`,
				},
			});
			if (authError) {
				error.value = authError.message;
				return false;
			}
			return true; // browser is redirecting to Google now
		} catch {
			error.value = "Couldn't start Google sign-in.";
			return false;
		}
	};

	const register = async (params: RegisterSchemaType): Promise<boolean> => {
		loading.value = true;
		error.value = null;
		try {
			const { error: authError } = await supabase.auth.signUp({
				email: params.email,
				password: params.password,
				options: {
					emailRedirectTo: `${origin}/confirm`,
					data: {
						name: params.name, // read by the handle_new_user trigger
					},
				},
			});
			if (authError) {
				error.value = authError.message;
				return false;
			}
			// User row is created by the DB trigger on auth.users insert.
			return true;
		} catch {
			error.value = "Registration failed.";
			return false;
		} finally {
			loading.value = false;
		}
	};

	const forgot = async (params: ResetSchemaType): Promise<boolean> => {
		loading.value = true;
		error.value = null;
		try {
			const { error: authError } = await supabase.auth.resetPasswordForEmail(
				params.email,
				{ redirectTo: `${origin}/recover` },
			);
			if (authError) {
				error.value = authError.message;
				return false;
			}
			return true;
		} catch {
			error.value = "Password reset request failed.";
			return false;
		} finally {
			loading.value = false;
		}
	};

	const recover = async (params: RecoverSchemaType): Promise<boolean> => {
		loading.value = true;
		error.value = null;
		try {
			const { error: authError } = await supabase.auth.updateUser({
				password: params.password,
			});
			if (authError) {
				error.value = authError.message;
				return false;
			}
			return true;
		} catch {
			error.value = "Password recovery failed.";
			return false;
		} finally {
			loading.value = false;
		}
	};

	const signOut = async (): Promise<boolean> => {
		try {
			const { error: authError } = await supabase.auth.signOut();
			if (authError) {
				console.error("Sign out error:", authError);
				return false;
			}
			userStore.clearAll();
			await navigateTo("/login");
			return true;
		} catch (err) {
			console.error("Sign out failed:", err);
			return false;
		}
	};

	return { user, error, loading, login, loginWithGoogle, register, forgot, recover, signOut };
};