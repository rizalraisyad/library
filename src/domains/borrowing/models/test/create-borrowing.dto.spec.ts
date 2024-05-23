import {
  CreateBorrowingDto,
  validateCreateBorrowingDto,
} from '../create-borrowing.dto';

describe('validateCreateBorrowingDto', () => {
  it('should return an empty error response for valid input', () => {
    const input: CreateBorrowingDto = {
      bookId: 'c27729c6-3282-4f13-896d-5ff0b4a93b63',
      memberId: '4e13239d-65fc-429d-a13b-36f45b0a8652',
    };

    const result = validateCreateBorrowingDto(input);

    expect(result.errors).toHaveLength(0);
  });

  it('should return error response for empty bookId', () => {
    const input: CreateBorrowingDto = {
      bookId: '',
      memberId: '4e13239d-65fc-429d-a13b-36f45b0a8652',
    };

    const result = validateCreateBorrowingDto(input);

    expect(result.errors).toHaveLength(2);
  });

  it('should return error response for invalid bookId format', () => {
    const input: CreateBorrowingDto = {
      bookId: 'invalid_uuid_format',
      memberId: '4e13239d-65fc-429d-a13b-36f45b0a8652',
    };

    const result = validateCreateBorrowingDto(input);

    expect(result.errors).toHaveLength(1);
  });

  it('should return error response for empty memberId', () => {
    const input: CreateBorrowingDto = {
      bookId: 'c27729c6-3282-4f13-896d-5ff0b4a93b63',
      memberId: '',
    };

    const result = validateCreateBorrowingDto(input);

    expect(result.errors).toHaveLength(2);
  });

  it('should return error response for invalid memberId format', () => {
    const input: CreateBorrowingDto = {
      bookId: 'c27729c6-3282-4f13-896d-5ff0b4a93b63',
      memberId: 'invalid_uuid_format',
    };

    const result = validateCreateBorrowingDto(input);

    expect(result.errors).toHaveLength(1);
  });
});
