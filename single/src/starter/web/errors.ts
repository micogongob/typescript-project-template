export class HttpBasedException extends Error {
  private constructor(
    public status: number,
    public messages: string[]
  ) {
    super(messages[0]);
    this.name = 'HttpBasedException';
    this.status = status;
    this.message = messages[0];
    this.messages = messages;
  }

  static withStatusAndMessage(status: number, ...messages: string[]): HttpBasedException {
    return new HttpBasedException(status, messages);
  }

  static badRequest(...messages: string[]): HttpBasedException {
    if (messages.length <= 0) {
      messages.push('Bad Request. Please check request parameters.');
    }
    return new HttpBasedException(400, messages);
  }

  static notFound(...messages: string[]): HttpBasedException {
    if (messages.length <= 0) {
      messages.push('Not Found. Please check request parameters.');
    }
    return new HttpBasedException(404, messages);
  }

  static internalServerError(...messages: string[]): HttpBasedException {
    if (messages) {
      messages.push('Internal error encountered.');
    }
    return new HttpBasedException(500, messages);
  }
}