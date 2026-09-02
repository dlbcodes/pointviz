// app/lib/shareLink.ts
import pkg from "lz-string";
import { ChartSpecSchema, type ChartSpec } from "~/lib/schema";

const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } = pkg;
// Bump this when the payload shape changes in a breaking way.
const CURRENT_VERSION = 1;

interface SharePayloadV1 {
	v: 1;
	spec: unknown; // validated on decode, not trusted here
}

type SharePayload = SharePayloadV1; // union grows as versions are added

export type DecodeResult =
	| { ok: true; spec: ChartSpec }
	| { ok: false; reason: "empty" | "corrupt" | "unsupported-version" | "invalid-spec" };

/** Encode a spec into a URL-safe, compressed, versioned string. */
export function encodeSpec(spec: ChartSpec): string {
	const payload: SharePayload = { v: CURRENT_VERSION, spec };
	return compressToEncodedURIComponent(JSON.stringify(payload));
}

/** Decode + validate an encoded string back into a spec. Never throws. */
export function decodeSpec(encoded: string): DecodeResult {
	if (!encoded) return { ok: false, reason: "empty" };

	let payload: SharePayload;
	try {
		const json = decompressFromEncodedURIComponent(encoded);
		if (!json) return { ok: false, reason: "corrupt" };
		payload = JSON.parse(json);
	} catch {
		return { ok: false, reason: "corrupt" };
	}

	// Version dispatch — this is where future migrations live.
	const migrated = migrateToCurrentSpec(payload);
	if (!migrated) return { ok: false, reason: "unsupported-version" };

	// Validate — the payload is untrusted input.
	const parsed = ChartSpecSchema.safeParse(migrated);
	if (!parsed.success) return { ok: false, reason: "invalid-spec" };

	return { ok: true, spec: parsed.data };
}

/**
 * Migrate any supported payload version up to the current spec shape.
 * When you bump CURRENT_VERSION, add a case that transforms the old shape.
 * Old links keep working because this migrates them forward.
 */
function migrateToCurrentSpec(payload: SharePayload): unknown | null {
	switch (payload.v) {
		case 1:
			return payload.spec;
		// case 2: return upgradeV1toV2(payload.spec);  ← future
		default:
			return null; // version newer than this client understands
	}
}