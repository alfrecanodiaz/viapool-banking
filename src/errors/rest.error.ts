/**
 * Base response represent a base for success responses
 * and error responses, extend this for create new responses types
 */
export interface BaseResponse<TData> {
  message: string;
  data?: TData;
}

export interface BaseError {
  message: string;
  errorCode?: string;
}

export interface RestErrorBase<TData> extends BaseError {
  httpStatus: number;
  data?: TData;
  metadata?: Record<string, string>;
}

/**
 * Implementation of [BaseResponse] for error responses
 */
export interface BaseErrorResponse<TData> extends BaseResponse<TData> {
  errorCode?: string;
}

/**
 * Base Error class for generic api errors
 */
export class ApiError<TData> extends Error implements BaseErrorResponse<TData> {
  errorCode?: string;

  constructor(error: BaseError) {
    super(error.message);
    this.errorCode = error.errorCode;
    Error.captureStackTrace(this);
  }
}

/**
 * Base error for http requests
 */
export class RestError<TData = any> extends ApiError<TData> {
  httpStatus: number;
  metadata?: Record<string, string>;

  constructor(error: RestErrorBase<TData>) {
    super({ message: error.message, errorCode: error.errorCode });
    this.httpStatus = error.httpStatus;
    this.metadata = error.metadata;
  }

  static isRestError(error: Error): error is RestError {
    return (
      error &&
      'httpStatus' in error &&
      'errorCode' in error &&
      'message' in error
    );
  }
}
