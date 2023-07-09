export class ErrorParser {
  private static DEFAULT_ERR_MSG = 'Unparseable exception message';

  static parseMessage(err: unknown): string {
    const msg = this.parseMessageOptional(err);
    if (msg === null) {
      return this.DEFAULT_ERR_MSG;
    }
    return msg;
  }

  private static parseMessageOptional(err: unknown): string | null {
    if (err === undefined || err === null) {
      return null;
    }
    if (typeof err === 'string') {
      return err;
    }
    if (typeof err === 'object') {
      if ('message' in err) {
        return this.parseMessageOptional(err.message);
      }
    }
    return null;
  }

  static parseStack(err: unknown): any {
    if (err === undefined || err === null) {
      return this.DEFAULT_ERR_MSG;
    }
    if (typeof err === 'string') {
      return err;
    }
    if (typeof err === 'object') {
      if ('stack' in err) {
        return err.stack;
      }
      if ('cause' in err) {
        return err.cause;
      }
    }
    return this.DEFAULT_ERR_MSG;
  }
}
// TODO unit tests