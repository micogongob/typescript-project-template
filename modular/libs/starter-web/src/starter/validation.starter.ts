import { ValidatorFunction } from '../types';
import { HttpBasedException } from '../errors';
import { ErrorParser } from '@local/starter-core';

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export class HeaderValidationStarter {
  static build(validator: z.ZodTypeAny): ValidatorFunction {
    return (req: Request, res: Response, next: NextFunction): Response | void => {
      const zParse = validator.safeParse(req.headers);
      if (!zParse.success) {
        throw HttpBasedException.badRequest(
          'Request header validation failed',
          ...ErrorParser.zodErrorToStrings(zParse.error)
        );
      }
      req['requestHeaders'] = zParse.data;
      return next();
    };
  }
}

export class BodyValidationStarter {
  static build(validator: z.ZodTypeAny): ValidatorFunction {
    return (req: Request, res: Response, next: NextFunction): Response | void => {
      const zParse = validator.safeParse(req.body);
      if (!zParse.success) {
        throw HttpBasedException.badRequest(
          'Request body validation failed',
          ...ErrorParser.zodErrorToStrings(zParse.error)
        );
      }
      req['requestBody'] = zParse.data;
      return next();
    };
  }
}
// TODO add request path validation