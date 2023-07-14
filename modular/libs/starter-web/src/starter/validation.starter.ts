import { ValidatorFunction } from '../types';
import { HttpBasedException } from '../errors';
import { ErrorParser } from '@local/starter-core';

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// TODO refactor to hold only in one middleware for validation
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

export class PathValidationStarter {
  static build(validator: z.ZodTypeAny): ValidatorFunction {
    return (req: Request, res: Response, next: NextFunction): Response | void => {
      const zParse = validator.safeParse(req.params);
      if (!zParse.success) {
        throw HttpBasedException.badRequest(
          'Path validation failed',
          ...ErrorParser.zodErrorToStrings(zParse.error)
        );
      }
      req['requestPath'] = zParse.data;
      return next();
    };
  }
}
