export class DatabaseGenericException extends Error {
  private constructor(
    public message: string
  ) {
    super(message);
    this.name = 'DatabaseGenericException';
    this.message = message;
  }

  static withMessage(msg: string): DatabaseGenericException {
    return new DatabaseGenericException(msg);
  }
}

export class DatabaseQueryResultMalformedException extends Error {
  private constructor(
    public message: string
  ) {
    super(message);
    this.name = 'DatabaseQueryResultMalformedException';
    this.message = message;
  }

  static withMessage(msg: string): DatabaseQueryResultMalformedException {
    return new DatabaseQueryResultMalformedException(msg);
  }
}


export class DatabaseNullResultException extends Error {
  private constructor(
    public message: string
  ) {
    super(message);
    this.name = 'DatabaseNullResultException';
    this.message = message;
  }

  static withMessage(msg: string): DatabaseNullResultException {
    return new DatabaseNullResultException(msg);
  }
}
