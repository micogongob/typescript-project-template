const DEFAULT_ERR_MSG = 'Unparseable exception message';

export function parseExceptionMessage(err: unknown): string {
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

export function parseExceptionStack(err: unknown): string {
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

export function logError(err: any, req: any, res: any, next: any): any {
  const errMsg = parseExceptionMessage(err);
  console.log(`Error occurred: ${errMsg}`);
  return next(err);
}

export function asApiError(err: any, req: any, res: any, next: any): any {
  const errMsg = parseExceptionMessage(err);
  return res.status(500).json({
    error: {
      message: errMsg
    }
  });
}

export function asPageError(templateName: string): any {
  return (err: any, req: any, res: any, next: any) => {
    const errMsg = parseExceptionMessage(err);
    return res.render(templateName, {
      error: {
        message: errMsg
      }
    });
  };
}
