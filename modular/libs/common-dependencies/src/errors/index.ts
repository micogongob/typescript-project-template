export class ErrorCodedException extends Error {
  private constructor(
    public code: string,
    message: string,
    public cause: any | null
  ) {
    super(message);
    this.code = code;
    this.message = message;
    this.cause = cause;
  }

  static withCode(code: string): ErrorCodedException {
    return new ErrorCodedException(code, `Encountered error with code: ${code}`, null);
  }

  static withCodeAndMessage(code: string, message: string): ErrorCodedException {
    return new ErrorCodedException(code, message, null);
  }

  static withCodeAndCause(code: string, cause: any): ErrorCodedException {
    return new ErrorCodedException(code, `Encountered error with code: ${code}`, cause);
  }
}