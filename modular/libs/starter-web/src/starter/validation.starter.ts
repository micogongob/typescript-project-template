import { ValidatorFunction } from '../types';
import { HttpBasedException } from '../errors';

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export class HeaderValidationStarter {
  static build(validator: z.ZodTypeAny): ValidatorFunction {
    return (req: Request, res: Response, next: NextFunction): Response | void => {
      const zParse = validator.safeParse(req.headers);
      if (!zParse.success) {
        console.error(JSON.stringify(zParse.error.errors));
        // TODO pass to exception e.g for string
        // [{"code":"invalid_type","expected":"string","received":"undefined","path":["rrn"],"message":"Required"}]
        throw HttpBasedException.badRequest();
      }
      return next();
    };
  }
}
