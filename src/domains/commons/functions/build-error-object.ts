import { ErrorObject } from '../../../exceptions/models/error-object';

export function buildErrorObject(title: string, detail?: string): ErrorObject {
  return new ErrorObject({
    title: title,
    detail: detail,
  });
}
