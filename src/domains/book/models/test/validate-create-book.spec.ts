import { CreateBookDto, validateCreateBookDto } from '../create-book.dto';

describe('validateCreateBookDto()', () => {
  it('should give no error when required field is filled correctly', () => {
    const payload = {
      author: 'Test',
      code: 'Test123',
      title: 'Test',
      stock: 1,
    } as CreateBookDto;

    const errResp = validateCreateBookDto(payload);

    expect(errResp.errors.length).toBe(0);
  });

  it('should give 3 error when required field is empty or undefined', () => {
    const payload = {
      author: '',
      code: '',
      title: '',
      stock: 1,
    } as CreateBookDto;

    const errResp = validateCreateBookDto(payload);
    const expected = [
      {
        title: 'CODE ERROR',
        detail: 'Code cannot be empty',
      },
      {
        title: 'AUTHOR ERROR',
        detail: 'AUTHOR cannot be empty',
      },
      {
        title: 'TITLE ERROR',
        detail: 'Title cannot be empty',
      },
    ];

    expect(errResp.errors.length).toBe(3);
    expect(errResp.errors).toEqual(expect.arrayContaining(expected));
  });

  it('error stock', () => {
    const payload = {
      author: 'test',
      code: 'test',
      title: 'test',
    } as CreateBookDto;

    const errResp = validateCreateBookDto(payload);
    const expected = [
      {
        title: 'STOCK ERROR',
        detail: 'Stock must be number / numeric',
      },
    ];

    expect(errResp.errors).toEqual(expect.arrayContaining(expected));
  });

  it('error stock', () => {
    const payload = {
      author: 'test',
      code: 'test',
      title: 'test',
      stock: -1,
    } as CreateBookDto;

    const errResp = validateCreateBookDto(payload);
    const expected = [
      {
        title: 'STOCK ERROR',
        detail: 'Stock cannot be below 0',
      },
    ];

    expect(errResp.errors).toEqual(expect.arrayContaining(expected));
  });
});
