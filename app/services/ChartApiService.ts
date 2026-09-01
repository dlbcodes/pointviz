// app/services/ChartApiService.ts
import { BaseApiService } from "./BaseApiService";
import { ApiError } from "./ApiError";
import type { ChartSpec } from "~/lib/schema";
import type { ChartSummary, ChartDetail } from "~~/shared/types/chart";

class ChartApiService extends BaseApiService {
	constructor() {
		super("/api/v1/charts");
	}

	async list(): Promise<ChartSummary[]> {
		try {
			return this._extractData<ChartSummary[]>(await $fetch(this.baseUrl));
		} catch (e) {
			throw this._handleError(e, "Failed to load your charts.", ApiError);
		}
	}

	async create(spec: ChartSpec, title?: string): Promise<ChartSummary> {
		try {
			return this._extractData<ChartSummary>(
				await $fetch(this.baseUrl, { method: "POST", body: { spec, title } }),
			);
		} catch (e) {
			throw this._handleError(e, "Failed to save chart.", ApiError);
		}
	}

	async get(id: string): Promise<ChartDetail> {
		try {
			return this._extractData<ChartDetail>(await $fetch(`${this.baseUrl}/${id}`));
		} catch (e) {
			throw this._handleError(e, "Failed to open chart.", ApiError);
		}
	}

	async update(id: string, patch: { title?: string | null; spec?: ChartSpec; isPublic?: boolean }): Promise<ChartSummary> {
		try {
			return this._extractData<ChartSummary>(
				await $fetch(`${this.baseUrl}/${id}`, { method: "PATCH", body: patch }),
			);
		} catch (e) {
			throw this._handleError(e, "Failed to update chart.", ApiError);
		}
	}

	async remove(id: string): Promise<void> {
		try {
			await $fetch(`${this.baseUrl}/${id}`, { method: "DELETE" });
		} catch (e) {
			throw this._handleError(e, "Failed to delete chart.", ApiError);
		}
	}

	async getPublic(slug: string): Promise<ChartDetail> {
		try {
			return this._extractData<ChartDetail>(await $fetch(`${this.baseUrl}/public/${slug}`));
		} catch (e) {
			throw this._handleError(e, "Chart not found.", ApiError);
		}
	}
}

export const chartApiService = new ChartApiService();