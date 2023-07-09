import * as errors from '../errors';
import * as types from '../types';

import debug from 'debug';

const warnLog = debug('app:warn');

export class HttpUtils {
  private static HTTP_STATUS_TO_TEXT_MAP = new Map<number, string>();

  static {
    this.HTTP_STATUS_TO_TEXT_MAP.set(200, '200 OK');
    this.HTTP_STATUS_TO_TEXT_MAP.set(201, '201 Created');
    this.HTTP_STATUS_TO_TEXT_MAP.set(400, '400 Bad Request');
    this.HTTP_STATUS_TO_TEXT_MAP.set(401, '401 Unauthorized');
    this.HTTP_STATUS_TO_TEXT_MAP.set(403, '403 Forbidden');
    this.HTTP_STATUS_TO_TEXT_MAP.set(404, '404 Not Found');
    this.HTTP_STATUS_TO_TEXT_MAP.set(429, '429 Too Many Requests');
    this.HTTP_STATUS_TO_TEXT_MAP.set(500, '500 Internal Server Error');
    this.HTTP_STATUS_TO_TEXT_MAP.set(503, '503 Gateway Timeout');
  }

  static statusToText(status: number): string {
    const mapping = this.HTTP_STATUS_TO_TEXT_MAP.get(status);
    if (mapping === undefined) {
      return this.HTTP_STATUS_TO_TEXT_MAP.get(500) as string;
    }
    return mapping;
  }

  static toSuccessfulResponse(payload: any, status = 200): types.SuccessfulResponse {
    if (!this.is2xxStatus(status)) {
      warnLog(`Invalid success status provided in function: ${status}. Overriding.`);
      status = 200;
    }

    return {
      status,
      statusText: this.statusToText(status),
      data: payload
    };
  }

  static toFailedResponse(status: number, payload: any[]): types.FailedResponse {
    if (this.is2xxStatus(status)) {
      warnLog(`Invalid failure status provided in function: ${status}. Overriding.`);
      status = 500;
    }

    return {
      status,
      statusText: this.statusToText(status),
      errors: payload
    };
  }

  static parseServerError(err: any): types.HttpErrorResult {
    if (err instanceof errors.HttpBasedException) {
      return this.parseHttpBasedError(err);
    }

    return {
      status: 500,
      errors: [{
        message: 'Internal server error encountered'
      }]
    };
  }

  static parseHttpBasedError(err: errors.HttpBasedException): types.HttpErrorResult {
    return {
      status: err.status,
      errors: [{
        message: err.message
      }]
    };
  }

  static is2xxStatus(status: number): boolean {
    return status >= 200 && status <= 299;
  }
}