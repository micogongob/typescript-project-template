import { z } from 'zod';

type BaseRawParams = {
  name?: string;
  message?: string;
  minSize?: number;
  maxSize?: number;
};

type NonBlankStringRawParams = {
  regex?: RegExp;
}
& BaseRawParams;
type AntiRegexStringRawParams = {
  allowBlank?: boolean;
} & BaseRawParams;
type BaseRawParamsSubTypes = 'NonBlankStringRawParams' | 'AntiRegexStringRawParams';

type BaseParsedParams = {
  name: string;
  message: string;
  minSize: number;
  maxSize: number;
};

type ParasedAntiRegexStringParams = {
  allowBlank: boolean;
} & BaseParsedParams;

export function nonBlankString(
  params: NonBlankStringRawParams = {}
): z.ZodEffects<z.ZodString, string, string> {
  const { minSize, maxSize, message } = getParamsOrDetault<BaseParsedParams>('NonBlankStringRawParams', params);

  let baseSchema: z.ZodString = z.string().min(minSize).max(maxSize);

  if (params.regex !== undefined) {
    baseSchema = baseSchema.regex(params.regex);
  }

  return baseSchema.refine((data: string) => {
      return data.trim() !== ''
    }, {
      message
    });
}

export function antiRegexString(
  pattern: RegExp,
  params: AntiRegexStringRawParams = {}
): z.ZodEffects<z.ZodEffects<z.ZodString, string, string> | z.ZodString, string, string> {
  const { minSize, maxSize, message, allowBlank } = getParamsOrDetault<ParasedAntiRegexStringParams>('AntiRegexStringRawParams', params);

  if (allowBlank) {
    return z.string().min(minSize).max(maxSize)
      .refine((data) => validateAntiPattern(data, pattern), { message });
  }

  return nonBlankString({ ...params, minSize, maxSize })
    .refine((data) => validateAntiPattern(data, pattern), { message });
}

function getParamsOrDetault<T>(type: BaseRawParamsSubTypes, params: NonBlankStringRawParams | AntiRegexStringRawParams): T {
  const parseResult: Record<string, string | number | boolean> = {};

  parseResult.name = params.name !== undefined ? params.name : 'String';
  parseResult.minSize = params.minSize !== undefined ? params.minSize : 1;
  parseResult.maxSize = params.maxSize !== undefined ? params.maxSize : 255;

  if (type === 'NonBlankStringRawParams') {
    parseResult.message = params.message ? params.message : `${parseResult.name} cannot be blank.`;
  } else if (type === 'AntiRegexStringRawParams') {
    parseResult.message = params.message ? params.message : `${parseResult.name} has invalid characters.`;
    const asBlankStringParams: AntiRegexStringRawParams = (params as AntiRegexStringRawParams);
    parseResult.allowBlank = asBlankStringParams.allowBlank !== undefined ? asBlankStringParams.allowBlank : true;
  } else {
    throw new Error('Invalid type provided: ' + type);
  }

  return parseResult as T;
}

function validateAntiPattern(aString: string, pattern: RegExp): boolean {
  return !pattern.test(aString);
}
