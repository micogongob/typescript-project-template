import { ValidatorFunction } from '../types';
import { HttpBasedException } from '../errors';
import { ErrorParser } from '../../core';

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

type RequestPathParameters = 'PATH_PARAMETERS';
type RequestHeaders = 'HEADERS';
type RequestBody = 'BODY';
type RequestType = RequestPathParameters | RequestHeaders | RequestBody;

export type ValidationSpecStarter = {
  pathParameters?: z.ZodTypeAny;
  headers?: z.ZodTypeAny;
  body?: z.ZodTypeAny;
};

export class HttpRequestValidationStarter {
  static build(spec: ValidationSpecStarter): ValidatorFunction {
    return (req: Request, res: Response, next: NextFunction): Response | void => {
      const errors: string[] = [];

      if (spec.pathParameters !== undefined) {
        this.validate('PATH_PARAMETERS', req, spec.pathParameters, errors);
      }
      if (spec.headers !== undefined) {
        this.validate('HEADERS', req, spec.headers, errors);
      }
      if (spec.body !== undefined) {
        this.validate('BODY', req, spec.body, errors);
      }

      if (errors.length > 0) {
        throw HttpBasedException.badRequest(...errors);
      } else {
        return next();
      }
    };
  }

  private static validate(type: RequestType, req: Request, validator: z.ZodTypeAny, errors: string[]): void {
    let paramsToValidate: unknown;
    let requestField: string;
    let additionalErrorMessage: string;
  
    switch (type) {
      case 'PATH_PARAMETERS':
        paramsToValidate = req.params;
        requestField = 'requestPathParameters';
        additionalErrorMessage = 'Path parameter validation failed.';
        break;
      case 'HEADERS':
        paramsToValidate = req.headers;
        requestField = 'requestHeaders';
        additionalErrorMessage = 'Request headers validation failed.';
        break;
      case 'BODY':
        paramsToValidate = req.body;
        requestField = 'requestBody';
        additionalErrorMessage = 'Request body validation failed.';
        break;
      default:
        throw new Error('Unknown request type provided');
    }
  
    const validated = validator.safeParse(paramsToValidate);
  
    if (validated.success) {
      req[requestField] = validated.data;
    } else {
      errors.push(additionalErrorMessage);
      errors.push(...ErrorParser.zodErrorToStrings(validated.error));
    }
  }
}
