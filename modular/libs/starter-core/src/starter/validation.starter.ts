import { z } from 'zod';

export function antiPatternString(
  pattern: RegExp,
  { name, message }: { name?: string, message?: string } = {}
): z.ZodEffects<z.ZodString, string, string> {
  return z.string().refine((data) => {
    return !pattern.test(data)
  }, {
    message: buildErrorMessage(name, message)
  });
}

function buildErrorMessage(name?: string, message?: string): string {
  const finalName = name ? name : 'String';
  const finalMessage = message ? message : `${finalName} has invalid characters.`;
  return finalMessage;
}
