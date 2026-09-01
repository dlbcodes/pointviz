// app/composables/useDataImport.ts
import { aiApiService, AiApiError } from "~/services/AiApiService";

// The free, bring-your-own-Claude prompt — everyone gets this.
export const IMPORT_PROMPT = `I have data I want to chart. Convert it into this exact JSON for PointViz. Respond with ONLY the JSON.

{
  "type": "bar" | "line" | "area",
  "orientation": "vertical" | "horizontal" (optional),
  "stack": true | false (optional),
  "title": "a short headline stating the takeaway" (optional),
  "subtitle": "the metric or units" (optional),
  "categories": ["label1", "label2", ...],
  "series": [{ "name": "series name", "values": [1, 2, ...] }]
}

Rules: each series' "values" must have one number per category, in order. Use only numbers I provide — never invent values. Pick the chart type that fits (line/area for trends, bar for comparisons).

MY DATA:
`;

export function useDataImport() {
	const { loadSpec } = useChartSpec();
	const user = useSupabaseUser();
	const authModalOpen = useState("auth-modal-open", () => false);
	const upgradeModalOpen = useState("upgrade-modal-open", () => false);

	const rawData = ref("");
	const pending = ref(false);
	const importError = ref<string | null>(null);
	const copied = ref(false);

	// Free path: copy the prompt for the user's own Claude.
	async function copyPrompt() {
		await navigator.clipboard.writeText(IMPORT_PROMPT);
		copied.value = true;
		setTimeout(() => (copied.value = false), 1500);
	}

	// Metered path: our server converts the pasted data.
	async function aiImport() {
		if (!user.value) {
			authModalOpen.value = true;
			return;
		}
		if (!rawData.value.trim() || pending.value) return;
		pending.value = true;
		importError.value = null;
		try {
			const { raw } = await aiApiService.interpret(rawData.value);
			loadSpec(raw);
			rawData.value = "";
		} catch (e) {
			if (e instanceof AiApiError) {
				if (e.kind === "unauthenticated") authModalOpen.value = true;
				else if (e.kind === "limit_reached") upgradeModalOpen.value = true;
				else importError.value = e.message;
			} else {
				importError.value = "Couldn't import that data.";
			}
		} finally {
			pending.value = false;
		}
	}

	return { rawData, pending, importError, copied, copyPrompt, aiImport, isLoggedIn: user };
}