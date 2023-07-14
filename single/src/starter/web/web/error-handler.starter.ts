import express from 'express';
import { ErrorParser } from '../../core';
import debug from 'debug';

import * as types from '../types';
import * as utils from '../utils';

const errorLog = debug('app:error');

export interface ErrorHandlerStarter {
  // NOTE: Needed to return middleware function here since if direct function,
  // only function is referenced by express and this will point to express?
  // unlike closure like syntax it captures whole object?
  // Reference: https://stackoverflow.com/questions/68662887/this-is-undefined-when-try-to-pass-class-methods-in-router-as-middleware-exp
  buildErrorHandler(): types.ErrorHandlerFunction;
}

export class DefaultConsoleLoggingErrorHandlerStarter implements ErrorHandlerStarter {
  buildErrorHandler(): types.ErrorHandlerFunction {
    return (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): express.Response | void => {
      errorLog(`App error encountered: ${ErrorParser.parseMessage(err)}`, ErrorParser.parseStack(err));
      return next(err);
    }
  }
}

export class DefaultErrorToRestResponseErrorHandler implements ErrorHandlerStarter {
  private errCodeMapping: Map<string, types.ErrorCodeInfo> = new Map<string, types.ErrorCodeInfo>();

  constructor(
    mappingConfig: types.ErrorCodeMappingConfig
  ) {
    for (const code in mappingConfig) {
      this.addErrorCode(code, mappingConfig[code]);
    }
  }

  private addErrorCode(code: string, codeInfo: types.ErrorCodeInfo): void {
    this.errCodeMapping.set(code, codeInfo);
  }

  buildErrorHandler(): types.ErrorHandlerFunction {
    return (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): express.Response | void => {
      const errorResult = utils.HttpUtils.parseServerException(err, res, this.errCodeMapping);
  
      res.set(utils.CONTENT_TYPE_HEADER, utils.APPLICATION_JSON_CONTENT_TYPE);
      return res.status(errorResult.status).json(utils.HttpUtils.toFailedResponse(
        errorResult.status,
        errorResult.errors
      ));
    }
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