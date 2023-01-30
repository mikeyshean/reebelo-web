export const enum API_ERROR {
  UNIQUE_OR_REQUIRED_FIELD = "unique_or_required",
  INSUFFICIENT_QUANTITY = "insufficient_quantity"
}

export class ApiError extends Error {
  readonly statusCode: number;
  readonly errorCode: API_ERROR;
  constructor(statusCode: number, message: string, errorCode: API_ERROR) {
    super()
    this.statusCode = statusCode
    this.message = message
    this.errorCode = errorCode
  }
}