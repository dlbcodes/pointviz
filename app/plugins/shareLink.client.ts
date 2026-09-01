// app/plugins/shareLink.client.ts
import { decodeSpec } from "~/lib/shareLink";

export default defineNuxtPlugin(() => {
	const hash = window.location.hash.slice(1);
	if (!hash) return;

	const result = decodeSpec(hash);

	const { loadSpec } = useChartSpec();
	if (result.ok) {
		loadSpec(JSON.stringify(result.spec, null, 2));
	} else {
		// Optional: surface a toast/notice for corrupt/invalid links.
		// For now, silently ignore — a bad link just shows the empty builder.
		console.warn("[shareLink] could not load shared chart:", result.reason);
	}

	// Clean the hash either way, so the URL tidies up and a refresh doesn't re-trigger.
	history.replaceState(null, "", window.location.pathname + window.location.search);
});