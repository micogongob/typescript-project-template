import path from 'path';
import proxyquire from 'proxyquire';
import R from 'ramda';

const DEFAULT_ERROR_MESSAGE = 'Unknown error occurred';

export function toErrorMessage(err: unknown): string {
  return R.pathOr(
    R.pathOr(DEFAULT_ERROR_MESSAGE, ['message'], err),
    ['stack'],
    err
  );
}

export function createProxyFunc<T>(importPath: string[], defaultOptionsProvider: () => any, strict: boolean = true, debug: boolean = false): any {
  function createProxyBase(additionalOptions: any = {}): T {
    const finalOptions: any = {
      ...additionalOptions,
      ...defaultOptionsProvider.call(null),
    }

    const finalImport = translateImport(importPath);

    if (debug) {
      console.log(`proxy import => ${finalImport}`);
      console.log(`proxy options => ${JSON.stringify(finalOptions)}`);
    }

    if (strict) {
      return proxyquire(finalImport, finalOptions) as T;
    } else {
      return proxyquire.noCallThru()(finalImport, finalOptions) as T;
    }
  }

  return createProxyBase;
}

function translateImport(origImport: string[]): string {
  return path.resolve(...origImport);
}