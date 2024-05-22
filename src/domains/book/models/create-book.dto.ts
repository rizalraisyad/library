import { ErrorResponse } from '../../../exceptions/models/error-object';
import validator from 'validator';
import { buildErrorObject } from '../../commons/functions/build-error-object';

export interface CreateBookDto {
  code: string;
  title: string;
  author: string;
  stock: number;
}

function validateCode(code: string, errResp: ErrorResponse): ErrorResponse {
  if (validator.isEmpty(code) || code === '') {
    errResp.errors.push(buildErrorObject('CODE ERROR', 'Code cannot be empty'));
  }

  return errResp;
}

function validateTitle(title: string, errResp: ErrorResponse): ErrorResponse {
  if (validator.isEmpty(title) || title === '') {
    errResp.errors.push(
      buildErrorObject('TITLE ERROR', 'Title cannot be empty'),
    );
  }

  return errResp;
}

function validateAuthor(author: string, errResp: ErrorResponse): ErrorResponse {
  if (validator.isEmpty(author) || author === '') {
    errResp.errors.push(
      buildErrorObject('AUTHOR ERROR', 'AUTHOR cannot be empty'),
    );
  }

  return errResp;
}

function validateStock(stock: number, errResp: ErrorResponse): ErrorResponse {
  if (typeof stock !== 'number') {
    errResp.errors.push(
      buildErrorObject('STOCK ERROR', 'Stock must be number / numeric'),
    );
  }

  if (Number(stock) < 0) {
    errResp.errors.push(
      buildErrorObject('STOCK ERROR', 'Stock cannot be below 0'),
    );
  }

  return errResp;
}

export function validateCreateBookDto(input: CreateBookDto): ErrorResponse {
  let errResp = new ErrorResponse();
  errResp.errors = [];

  errResp = validateCode(input.code, errResp);

  errResp = validateAuthor(input.author, errResp);

  errResp = validateTitle(input.title, errResp);

  errResp = validateStock(input.stock, errResp);

  return errResp;
}
