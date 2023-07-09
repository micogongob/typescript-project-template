import express from 'express';
import { ErrorParser } from '@local/common-dependencies';
import debug from 'debug';

import { ErrorCodedException } from '@local/common-dependencies';
import * as types from '../types';
import * as utils from '../utils';

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
    const errorResult = utils.HttpUtils.parseServerError(err);

    res.set(utils.CONTENT_TYPE_HEADER, utils.APPLICATION_JSON_CONTENT_TYPE);
    return res.status(errorResult.status).json(utils.HttpUtils.toFailedResponse(
      errorResult.status,
      errorResult.errors
    ));
  }
}

// TODO support page/template error response
/**
 * static asPageError(templateName: string): any {
    return (err: any, req: any, res: any, next: any) => {
      const errMsg = this.parseExceptionMessage(err);
      return res.render(templateName, {
        error: {
          message: errMsg
        }
      });
    };
  }
 */