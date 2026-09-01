// app/composables/useCustomize.ts
import { aiApiService, AiApiError } from "~/services/AiApiService";

export function useCustomize() {
	const { spec, isValid, loadSpec } = useChartSpec();

	const instruction = ref("");
	const pending = ref(false);
	const customizeError = ref<string | null>(null);

	const user = useSupabaseUser();
	const authModalOpen = useState("auth-modal-open", () => false);
	const upgradeModalOpen = useState("upgrade-modal-open", () => false);

	async function customize() {
		// Client-side wall: don't even call the API if not signed in.
		if (!user.value) {
			authModalOpen.value = true;
			return;
		}

		if (!instruction.value.trim() || pending.value) return;
		if (!spec.value) {
			customizeError.value = "Load a valid chart first.";
			return;
		}

		pending.value = true;
		customizeError.value = null;
		try {
			const { raw } = await aiApiService.customize(spec.value, instruction.value);
			loadSpec(raw); // becomes the new current spec → next edit builds on it
			instruction.value = "";
		} catch (e) {
			if (e instanceof AiApiError) {
				// Route each failure to the right UI, not a generic error.
				if (e.kind === "unauthenticated") {
					authModalOpen.value = true; // session expired / bypassed client check
				} else if (e.kind === "limit_reached") {
					upgradeModalOpen.value = true; // free-tier cap hit → upsell
				} else {
					customizeError.value = e.message; // invalid / failed → inline text
				}
			} else {
				customizeError.value = "Couldn't apply that change.";
			}
		} finally {
			pending.value = false;
		}
	}

	// canCustomize gates the UI until there's a valid spec to edit.
	return {
		instruction,
		pending,
		customizeError,
		customize,
		canCustomize: isValid,
		authModalOpen,
		upgradeModalOpen,
	};
}