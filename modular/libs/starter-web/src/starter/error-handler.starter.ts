import express from 'express';
import { ErrorParser } from '@local/common-dependencies';
import debug from 'debug';

import * as errors from '../errors';
import * as utils from '../utils';

const CONTENT_TYPE = 'content-type';
const APPLICATION_JSON = 'application/json';

const errorLog = debug('app:error');

export interface ErrorHandlerStarter {
  handleError(
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): express.Response | void;
}

export class DefaultConsoleLoggingErrorHandlerStarter implements ErrorHandlerStarter {
  handleError(
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): express.Response | void {
    errorLog(`App error encountered: ${ErrorParser.parseMessage(err)}`, ErrorParser.parseStack(err));
    return next(err);
  }
}

export class DefaultErrorToRestResponseErrorHandler implements ErrorHandlerStarter {
  constructor() {}

  handleError(
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): express.Response | void {
    let status: number = 500;
    let errorMsgs: string[] = ['Unexpected error encountered'];
  
    if (err instanceof errors.HttpBasedException) {
      status = err.status;
      errorMsgs = [err.message];
    }

    res.header(CONTENT_TYPE, APPLICATION_JSON);
    return res.status(status).json({
      status,
      statusText: utils.HttpStatusMessageMapper.mapStatus(status),
      errors: errorMsgs.map((e) => {
        return {
          message: e
        };
      })
    });
  }
}

