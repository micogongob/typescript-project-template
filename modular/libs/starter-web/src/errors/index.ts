export class HttpBasedException extends Error {
  private constructor(
    public status: number,
    public message: string
  ) {
    super(message);
    this.status = status;
    this.message = message;
  }

  static withStatusAndMessage(status: number, message: string): HttpBasedException {
    return new HttpBasedException(status, message);
  }

  static badRequest(): HttpBasedException {
    return new HttpBasedException(400, 'Bad Request. Please check request parameters.');
  }

  static badRequestWithMessage(message: string): HttpBasedException {
    return new HttpBasedException(400, message);
  }

  static notFound(): HttpBasedException {
    return new HttpBasedException(404, 'Not Found. Please check request parameters.');
  }

  static notFoundWithMessage(message: string): HttpBasedException {
    return new HttpBasedException(404, message);
  }

  static internalServerError(): HttpBasedException {
    return new HttpBasedException(500, 'Internal error encountered.');
  }

  static internalServerErrorWithMessage(message: string): HttpBasedException {
    return new HttpBasedException(500, message);
  }
}