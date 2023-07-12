import { z } from 'zod';

type BaseRawParams = {
  name?: string;
  message?: string;
  minSize?: number;
  maxSize?: number;
};

type NonBlankStringRawParams = BaseRawParams;
type BlackListStringRawParams = {
  allowBlank?: boolean;
} & BaseRawParams;
type BaseRawParamsSubTypes = 'NonBlankStringRawParams' | 'BlackListStringRawParams';

type BaseParsedParams = {
  name: string;
  message: string;
  minSize: number;
  maxSize: number;
};

type ParasedBlackListStringParams = {
  allowBlank: boolean;
} & BaseParsedParams;

export function nonBlankString(
  params: NonBlankStringRawParams = {}
): z.ZodEffects<z.ZodString, string, string> {
  const { minSize, maxSize, message } = getParamsOrDetault<BaseParsedParams>('NonBlankStringRawParams', params);
  return z.string().min(minSize).max(maxSize)
    .refine((data: string) => {
      return data.trim() !== ''
    }, {
      message
    });
}

export function blackListString(
  pattern: RegExp,
  params: BlackListStringRawParams = {}
): z.ZodEffects<z.ZodEffects<z.ZodString, string, string> | z.ZodString, string, string> {
  const { minSize, maxSize, message, allowBlank } = getParamsOrDetault<ParasedBlackListStringParams>('BlackListStringRawParams', params);

  if (allowBlank) {
    return z.string().min(minSize).max(maxSize)
      .refine((data) => validateBlackListPattern(data, pattern), { message });
  }

  return nonBlankString({ ...params, minSize, maxSize })
    .refine((data) => validateBlackListPattern(data, pattern), { message });
}

function getParamsOrDetault<T>(type: BaseRawParamsSubTypes, params: NonBlankStringRawParams | BlackListStringRawParams): T {
  const parseResult: Record<string, string | number | boolean> = {};

  parseResult.name = params.name !== undefined ? params.name : 'String';
  parseResult.minSize = params.minSize !== undefined ? params.minSize : 1;
  parseResult.maxSize = params.maxSize !== undefined ? params.maxSize : 255;

  if (type === 'NonBlankStringRawParams') {
    parseResult.message = params.message ? params.message : `${parseResult.name} cannot be blank.`;
  } else if (type === 'BlackListStringRawParams') {
    parseResult.message = params.message ? params.message : `${parseResult.name} has invalid characters.`;
    const asBlankStringParams: BlackListStringRawParams = (params as BlackListStringRawParams);
    parseResult.allowBlank = asBlankStringParams.allowBlank !== undefined ? asBlankStringParams.allowBlank : true;
  } else {
    throw new Error('Invalid type provided: ' + type);
  }

  return parseResult as T;
}

function validateBlackListPattern(aString: string, pattern: RegExp): boolean {
  return !pattern.test(aString);
}
