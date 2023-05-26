export function extractMessageFromErr(err: any): string {
  if (typeof err === 'string') {
    return err;
  }
  if (err.message && err.stack) {
    return `${err.message} - ${err.stack}`;
  }
  if (err.message) {
    return err.message;
  }
  if (err.stack) {
    return err.stack;
  }
  return 'Unparseable error';
}

export function logError(err: any, req: any, res: any, next: any): any {
  const errMsg = extractMessageFromErr(err);
  console.log(`Error occurred: ${errMsg}`);
  return next(err);
}

export function asApiError(err: any, req: any, res: any, next: any): any {
  const errMsg = extractMessageFromErr(err);
  return res.status(500).json({
    error: {
      message: errMsg
    }
  });
}

export function asPageError(templateName: string): any {
  return (err: any, req: any, res: any, next: any) => {
    const errMsg = extractMessageFromErr(err);
    return res.render(templateName, {
      error: {
        message: errMsg
      }
    });
  };
}
