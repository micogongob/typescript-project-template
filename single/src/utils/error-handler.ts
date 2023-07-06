const DEFAULT_ERR_MSG = 'Unparseable exception message';

export class ErrorHandler {
  static parseExceptionMessage(err: unknown): string {
    if (err === undefined || err === null) {
      return DEFAULT_ERR_MSG;
    }
    if (typeof err === 'string') {
      return err;
    }
    if (typeof err === 'object') {
      if ('message' in err) {
        return err.message as string;
      }
    }
    return DEFAULT_ERR_MSG;
  }

  static parseExceptionStack(err: unknown): string {
    if (err === undefined || err === null) {
      return DEFAULT_ERR_MSG;
    }
    if (typeof err === 'string') {
      return err;
    }
    if (typeof err === 'object') {
      if ('message' in err && 'stack' in err) {
        return `${err.message} - ${err.stack}`;
      }
      if ('message' in err) {
        return err.message as string;
      }
      if ('stack' in err) {
        return err.stack as string;
      }
    }
    return DEFAULT_ERR_MSG;
  }

  static logError(err: any, req: any, res: any, next: any): any {
    const errMsg = this.parseExceptionMessage(err);
    console.log(`Error occurred: ${errMsg}`);
    return next(err);
  }

  static asApiError(err: any, req: any, res: any, next: any): any {
    const errMsg = this.parseExceptionMessage(err);
    return res.status(500).json({
      error: {
        message: errMsg
      }
    });
  }

  static asPageError(templateName: string): any {
    return (err: any, req: any, res: any, next: any) => {
      const errMsg = this.parseExceptionMessage(err);
      return res.render(templateName, {
        error: {
          message: errMsg
        }
      });
    };
  }
}
