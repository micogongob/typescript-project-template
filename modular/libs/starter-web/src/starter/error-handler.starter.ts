import express from 'express';
import { ErrorParser } from '@local/common-dependencies';
import debug from 'debug';

import { ErrorCodedException } from '@local/common-dependencies';
import * as errors from '../errors';
import * as utils from '../utils';

const CONTENT_TYPE = 'content-type';
const APPLICATION_JSON = 'application/json';
const ERROR_CODE = 'err-code';

const errorLog = debug('app:error');

type MappedErrorCode = {
  status: number;
  message?: string;
};

type ParsedErrorCode = {
  status: number;
  message: string;
};

type HttpErrorParseResult = {
  status: number;
  errorMsgs: string[];
};

export type ErrorCodeMappings = {
  [k: string]: MappedErrorCode;
};


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
  private errorCodeMapping: Map<string, MappedErrorCode> = new Map<string, MappedErrorCode>();

  constructor(mappings: ErrorCodeMappings) {
    console.log(JSON.stringify(mappings));
    for (const key in mappings) {
      const mappedErrorCode = mappings[key];
      this.addErrorCode(key, mappedErrorCode.status, mappedErrorCode.message);
    }
  }

  // TODO might relocate when supporting page errors
  private addErrorCode(code: string, status: number, message: string | undefined): void {
    this.errorCodeMapping.set(code,
      {
        status,
        message
      }
    );
  }

  handleError(
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): express.Response | void {
    // TODO fix null here, might need to be closure?
    console.log(this.errorCodeMapping.size);
    this.addErrorCode('test', 200, 'test');
    console.log('NINJA');
    console.log(this.parseError);
    const parsedResult = this.parseError(err, res);

    res.header(CONTENT_TYPE, APPLICATION_JSON);
    return res.status(parsedResult.status).json({
      status: parsedResult.status,
      statusText: utils.HttpStatusMessageMapper.mapStatus(parsedResult.status),
      errors: parsedResult.errorMsgs.map((e) => {
        return {
          message: e
        };
      })
    });
  }

  // TODO might relocate when supporting page errors
  private parseError(
    err: any,
    res: express.Response
  ): HttpErrorParseResult {
    if (err instanceof errors.HttpBasedException) {
      return {
        status: err.status,
        errorMsgs: [err.message]
      };
    } else if (err instanceof ErrorCodedException) {
      const parsedErrorCode = this.mapError(err);

      if (parsedErrorCode === null) {
        res.set(ERROR_CODE, err.code);
        return {
          status: 500,
          errorMsgs: [
            err.message,
            'Unmapped error encountered: ' + err.code
          ]
        };
      }
      return {
        status: parsedErrorCode.status,
        errorMsgs: [parsedErrorCode.message]
      };
    }

    return {
      status: 500,
      errorMsgs: ['Unexpected error encountered']
    };
  }

  private mapError(err: ErrorCodedException): ParsedErrorCode | null {
    const mappedErrorCode = this.errorCodeMapping.get(err.code);
    if (mappedErrorCode === undefined) {
      return null;
    }

    const message = mappedErrorCode.message ? mappedErrorCode.message : err.message;
    return {
      message,
      status: mappedErrorCode.status
    };
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