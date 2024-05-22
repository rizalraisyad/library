import { HttpException } from '@nestjs/common';
import { ErrorObject } from './error-object';

export class GeneralException extends HttpException {
  constructor(args: string | ErrorObject[], httpStatus: number) {
    super(args, httpStatus);
  }
}
