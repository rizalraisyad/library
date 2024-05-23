import { ErrorResponse } from '../../../exceptions/models/error-object';
import validator from 'validator';
import { buildErrorObject } from '../../commons/functions/build-error-object';

export interface CreateBorrowingDto {
  bookId: string;
  memberId: string;
}

export function validateUUID(input: string): boolean {
  if (input === undefined) return false;
  return validator.isUUID(input);
}

function validateBookId(bookId: string, errResp: ErrorResponse): ErrorResponse {
  if (validator.isEmpty(bookId) || bookId === '') {
    errResp.errors.push(
      buildErrorObject('BOOKID ERROR', 'BookId cannot be empty'),
    );
  }

  if (!validateUUID(bookId)) {
    errResp.errors.push(
      buildErrorObject('BOOKID ERROR', 'BookId must be UUID'),
    );
  }

  return errResp;
}

function validateMemberId(
  memberId: string,
  errResp: ErrorResponse,
): ErrorResponse {
  if (validator.isEmpty(memberId) || memberId === '') {
    errResp.errors.push(
      buildErrorObject('MEMBERID ERROR', 'MemberId cannot be empty'),
    );
  }

  if (!validateUUID(memberId)) {
    errResp.errors.push(
      buildErrorObject('MEMBERID ERROR', 'MemberId must be UUID'),
    );
  }

  return errResp;
}

export function validateCreateBorrowingDto(
  input: CreateBorrowingDto,
): ErrorResponse {
  let errResp = new ErrorResponse();
  errResp.errors = [];

  errResp = validateBookId(input.bookId, errResp);

  errResp = validateMemberId(input.memberId, errResp);

  return errResp;
}
