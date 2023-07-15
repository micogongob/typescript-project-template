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


export class DatabaseEmptyResultException extends Error {
  private constructor(
    public message: string
  ) {
    super(message);
    this.name = 'DatabaseEmptyResultException';
    this.message = message;
  }

  static withMessage(msg: string): DatabaseEmptyResultException {
    return new DatabaseEmptyResultException(msg);
  }
}
