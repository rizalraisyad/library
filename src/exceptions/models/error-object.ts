export class ErrorObject {
  title = 'Generic Error';
  detail?: string;
  meta?: any;

  constructor(args?: Partial<ErrorObject>) {
    Object.assign(this, args);
  }
}

export class ErrorResponse {
  errors: ErrorObject[];

  static buildWithMessage(title: string, detail: string): ErrorResponse {
    const obj = new ErrorObject({
      detail,
      title,
    });

    const err = new ErrorResponse();
    err.errors = [obj];

    return err;
  }

  static buildWithErrors(errors: ErrorObject[]): ErrorResponse {
    const err = new ErrorResponse();
    err.errors = errors;

    return err;
  }
}
