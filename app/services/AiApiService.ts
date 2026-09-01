// app/services/AiApiService.ts
import { BaseApiService } from "./BaseApiService";
import { ApiError } from "./ApiError";
import type { ChartSpec } from "~/lib/schema";

export interface CustomizeResult {
	spec: ChartSpec;
	raw: string;
}

// Distinct failure kinds the UI needs to route on.
export type AiErrorKind = "unauthenticated" | "limit_reached" | "invalid" | "failed";

export class AiApiError extends ApiError {
	kind: AiErrorKind;
	constructor(message: string, kind: AiErrorKind) {
		super(message);
		this.kind = kind;
	}
}

class AiApiService extends BaseApiService {
	constructor() {
		super("/api/v1/ai");
	}

	async customize(currentSpec: ChartSpec, instruction: string): Promise<CustomizeResult> {
		try {
			return this._extractData<CustomizeResult>(
				await $fetch(`${this.baseUrl}/customize`, {
					method: "POST",
					body: { currentSpec, instruction },
				}),
			);
		} catch (error) {
			// Map HTTP status → actionable kind so the caller can route the UI.
			const status = (error as { statusCode?: number; status?: number })?.statusCode
				?? (error as { response?: { status?: number } })?.response?.status;

			if (status === 401) {
				throw new AiApiError("Please sign in to customize.", "unauthenticated");
			}
			if (status === 429) {
				throw new AiApiError(
					"You've hit your free customization limit.",
					"limit_reached",
				);
			}
			if (status === 400) {
				throw new AiApiError("Couldn't apply that change.", "invalid");
			}
			throw new AiApiError("Couldn't apply that change. Try rephrasing.", "failed");
		}
	}

	async interpret(data: string): Promise<CustomizeResult> {
		try {
			return this._extractData<CustomizeResult>(
				await $fetch(`${this.baseUrl}/interpret`, {
					method: "POST",
					body: { data },
				}),
			);
		} catch (error) {
			const status = (error as { statusCode?: number })?.statusCode
				?? (error as { response?: { status?: number } })?.response?.status;
			if (status === 401) throw new AiApiError("Please sign in to use AI import.", "unauthenticated");
			if (status === 429) throw new AiApiError("You've hit your free limit.", "limit_reached");
			if (status === 413) throw new AiApiError("That data is too large. Trim it or paste a spec.", "invalid");
			throw new AiApiError("Couldn't read that data. Try reformatting.", "failed");
		}
	}
}

export const aiApiService = new AiApiService();