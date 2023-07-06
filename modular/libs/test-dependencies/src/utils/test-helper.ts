import path from 'path';
import proxyquire from 'proxyquire';
import R from 'ramda';

export class TestHelper {
  private static DEFAULT_ERROR_MESSAGE = 'Unknown error occurred';

  static toErrorMessage(err: unknown): string {
    return R.pathOr(
      R.pathOr(this.DEFAULT_ERROR_MESSAGE, ['message'], err),
      ['stack'],
      err
    );
  }

  static createProxyFunc<T>(
    importPath: string[],
    defaultOptionsProvider: () => any,
    strict = true,
    debug = false
  ): any {
    function createProxyBase(additionalOptions: any = {}): T {
      const finalOptions: any = {
        ...additionalOptions,
        ...defaultOptionsProvider.call(null)
      };

      const finalImport = TestHelper.translateImport(importPath);

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

  private static translateImport(origImport: string[]): string {
    return path.resolve(...origImport);
  }
}
