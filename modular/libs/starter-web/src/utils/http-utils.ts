import { Response } from 'express';

import { ErrorCodedException } from '@local/starter-core';
import * as errors from '../errors';
import * as types from '../types';
import * as utils from '../utils';

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

  static is2xxStatus(status: number): boolean {
    return status >= 200 && status <= 299;
  }

  static parseServerException(err: any, res: Response, errCodeMapping: Map<string, types.ErrorCodeInfo>): types.HttpErrorResult {
    if (err instanceof errors.HttpBasedException) {
      return this.parseHttpBasedException(err);
    }
    if (err instanceof ErrorCodedException) {
      return this.parseErrorCodedException(err, res, errCodeMapping);
    }

    return {
      status: 500,
      errors: [
        {
          message: 'Internal server error encountered'
        }
      ]
    };
  }

  private static parseHttpBasedException(err: errors.HttpBasedException): types.HttpErrorResult {
    return {
      status: err.status,
      errors: err.messages.map((e) => {
        return {
          message: e
        };
      })
    };
  }

  private static parseErrorCodedException(err: ErrorCodedException, res: Response, errCodeMapping: Map<string, types.ErrorCodeInfo>): types.HttpErrorResult {
    const mapping: types.ErrorCodeInfo | undefined = errCodeMapping.get(err.code);

    if (mapping === undefined) {
      res.set(utils.ERROR_CODE_HEADER, err.code);
      return {
        status: 500,
        errors: [
          {
            message: err.message
          },
          {
            message: 'Unmapped error code encountered'
          }
        ]
      };
    }

    const errorMsgs: any[] = [
      {
        message: err.message
      }
    ];

    if (mapping.message !== undefined) {
      errorMsgs.push({ message: mapping.message });
    }

    return {
      status: mapping.status,
      errors: errorMsgs
    };
  }
}