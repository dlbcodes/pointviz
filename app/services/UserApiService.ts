// app/services/UserApiService.ts
import { BaseApiService } from "./BaseApiService";
import { ApiError } from "./ApiError";
import type { Me, UpdateMeInput } from "~~/shared/types/user";

class UserApiService extends BaseApiService {
	constructor() {
		super("/api/v1/me");
	}

	async get(): Promise<Me> {
		try {
			return this._extractData<Me>(await $fetch(this.baseUrl));
		} catch (error) {
			throw this._handleError(error, "Failed to load your account.", ApiError);
		}
	}

	async update(input: UpdateMeInput): Promise<Me> {
		try {
			return this._extractData<Me>(
				await $fetch(this.baseUrl, { method: "PATCH", body: input }),
			);
		} catch (error) {
			throw this._handleError(error, "Failed to update your account.", ApiError);
		}
	}
}

export const userApiService = new UserApiService();