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
        throw HttpBasedException.badRequest(...ErrorParser.zodErrorToStrings(zParse.error));
      }
      return next();
    };
  }
}
