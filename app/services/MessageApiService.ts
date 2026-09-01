import { BaseApiService } from "./BaseApiService";
import { ApiError } from "./ApiError";

class MessageApiService extends BaseApiService {
	constructor() {
		super("/api/v1");
	}

	async sendHelp(subject: string, message: string): Promise<{ ok: boolean }> {
		try {
			return this._extractData<{ ok: boolean }>(
				await $fetch(`${this.baseUrl}/messages`, {
					method: "POST",
					body: { kind: "help", subject, message },
				}),
			);
		} catch (e) {
			throw this._handleError(e, "Couldn't send your message.", ApiError);
		}
	}

	async sendFeedback(
		message: string,
		rating?: number,
	): Promise<{ ok: boolean }> {
		try {
			return this._extractData<{ ok: boolean }>(
				await $fetch(`${this.baseUrl}/messages`, {
					method: "POST",
					body: { kind: "feedback", message, rating },
				}),
			);
		} catch (e) {
			throw this._handleError(e, "Couldn't send your feedback.", ApiError);
		}
	}
}

export const messageApiService = new MessageApiService();