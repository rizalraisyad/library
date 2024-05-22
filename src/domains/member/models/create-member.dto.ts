import { ErrorResponse } from '../../../exceptions/models/error-object';
import validator from 'validator';
import { buildErrorObject } from '../../commons/functions/build-error-object';

export interface CreateMemberDto {
  code: string;
  name: string;
}

function validateCode(code: string, errResp: ErrorResponse): ErrorResponse {
  if (validator.isEmpty(code) || code === '') {
    errResp.errors.push(buildErrorObject('CODE ERROR', 'Code cannot be empty'));
  }

  return errResp;
}

function validateName(name: string, errResp: ErrorResponse): ErrorResponse {
  if (validator.isEmpty(name) || name === '') {
    errResp.errors.push(buildErrorObject('NAME ERROR', 'Name cannot be empty'));
  }

  return errResp;
}

export function validateCreateMemberDto(input: CreateMemberDto): ErrorResponse {
  let errResp = new ErrorResponse();
  errResp.errors = [];

  errResp = validateCode(input.code, errResp);

  errResp = validateName(input.name, errResp);

  return errResp;
}
