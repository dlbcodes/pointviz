type ApiErrorConstructor = new (
	message: string,
	statusCode?: number,
	originalError?: unknown,
) => Error;

export abstract class BaseApiService {
	protected readonly baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	protected _handleError(
		error: any,
		fallback: string,
		ErrorClass: ApiErrorConstructor,
	): Error {
		const message =
			error?.data?.message ||
			error?.data?.statusMessage ||
			error?.statusMessage ||
			error?.message ||
			fallback;
		const statusCode = error?.status || error?.statusCode || 500;
		return new ErrorClass(message, statusCode, error);
	}

	protected _extractData<T>(response: any, key?: string): T {
		const data = key ? response?.[key] : (response?.data ?? response);
		if (data === undefined || data === null) {
			throw new Error("API returned an empty response");
		}
		return data as T;
	}
}