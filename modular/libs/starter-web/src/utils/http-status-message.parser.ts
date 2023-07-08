export class HttpStatusMessageMapper {
  private static HTTP_STATUS_TO_STRING_MAP = new Map<number, string>();

  static {
    this.HTTP_STATUS_TO_STRING_MAP.set(200, '200 OK');
    this.HTTP_STATUS_TO_STRING_MAP.set(201, '201 Created');
    this.HTTP_STATUS_TO_STRING_MAP.set(400, '400 Bad Request');
    this.HTTP_STATUS_TO_STRING_MAP.set(401, '401 Unauthorized');
    this.HTTP_STATUS_TO_STRING_MAP.set(403, '403 Forbidden');
    this.HTTP_STATUS_TO_STRING_MAP.set(404, '404 Not Found');
    this.HTTP_STATUS_TO_STRING_MAP.set(429, '429 Too Many Requests');
    this.HTTP_STATUS_TO_STRING_MAP.set(500, '500 Internal Server Error');
    this.HTTP_STATUS_TO_STRING_MAP.set(503, '503 Gateway Timeout');
  }

  static mapStatus(status: number): string {
    const mapping = this.HTTP_STATUS_TO_STRING_MAP.get(status);
    return mapping === undefined ?
      this.HTTP_STATUS_TO_STRING_MAP.get(500) as string
      : mapping;
  }

}
