export class ApiError extends Error {
	statusCode: number;
	originalError?: unknown;

	constructor(message: string, statusCode = 500, originalError?: unknown) {
		super(message);
		this.name = "ApiError";
		this.statusCode = statusCode;
		this.originalError = originalError;
	}
}