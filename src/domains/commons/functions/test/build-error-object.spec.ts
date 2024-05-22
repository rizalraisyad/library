import { ErrorObject } from 'src/exceptions/models/error-object';
import { buildErrorObject } from '../build-error-object';

describe('buildErrorObject', () => {
  it('should return an ErrorObject with the given title and detail', () => {
    const title = 'Test Error Title';
    const detail = 'Test error detail';
    const errorObject = buildErrorObject(title, detail);

    expect(errorObject).toBeInstanceOf(ErrorObject);
    expect(errorObject.title).toBe(title);
    expect(errorObject.detail).toBe(detail);
  });

  it('should return an ErrorObject with the given title and undefined detail when detail is not provided', () => {
    const title = 'Test Error Title';
    const errorObject = buildErrorObject(title);

    expect(errorObject).toBeInstanceOf(ErrorObject);
    expect(errorObject.title).toBe(title);
    expect(errorObject.detail).toBeUndefined();
  });
});
