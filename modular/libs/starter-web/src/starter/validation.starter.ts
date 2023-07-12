import { ValidatorFunction } from '../types';
import { HttpBasedException } from '../errors';
import { STANDARD_BLACKLIST_CHAR_REGEX } from '@local/starter-core';

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export class HeaderValidationStarter {
  static build(validator: z.ZodTypeAny): ValidatorFunction {
    return (req: Request, res: Response, next: NextFunction): Response | void => {
      validateRequestHeaders(req, validator);
      return next();
    };
  }
}

export class HeaderBlackListValidationStarter {
  static build(
    validator: z.ZodTypeAny,
    validateHeaders: string[],
    pattern: RegExp = STANDARD_BLACKLIST_CHAR_REGEX
  ): ValidatorFunction {
    return (req: Request, res: Response, next: NextFunction): Response | void => {
      validateRequestHeaders(req, validator);

      for (const header of validateHeaders) {
        console.log(header);
        const toValidate: string | string[] | undefined = req.headers[header];

        if (toValidate !== undefined) {
          if (typeof toValidate === 'string') {
            validateStringRegex(`${header} header`, toValidate, pattern);
          } else {
            for (const subHeaders of toValidate) {
              validateStringRegex(`${header} header`, subHeaders, pattern);
            }
          }
        }
      }

      return next();
    };
  }
}

function validateRequestHeaders(req: Request, validator: z.ZodTypeAny): void {
  const zParse = validator.safeParse(req.headers);
  if (!zParse.success) {
    console.error(JSON.stringify(zParse.error.errors));
    // TODO pass to exception e.g for string
    // [{"code":"invalid_type","expected":"string","received":"undefined","path":["rrn"],"message":"Required"}]
    throw HttpBasedException.badRequest();
  }
}

function validateStringRegex(fieldName: string, aString: string, pattern: RegExp): void {
  if (pattern.test(aString)) {
    throw HttpBasedException.badRequest(`${fieldName} has invalid characters.`);
  }
}