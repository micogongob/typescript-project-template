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

  static badRequest(message = 'Bad Request. Please check request parameters.'): HttpBasedException {
    return new HttpBasedException(400, message);
  }

  static notFound(message = 'Not Found. Please check request parameters.'): HttpBasedException {
    return new HttpBasedException(404, message);
  }

  static internalServerError(message = 'Internal error encountered.'): HttpBasedException {
    return new HttpBasedException(500, message);
  }
}