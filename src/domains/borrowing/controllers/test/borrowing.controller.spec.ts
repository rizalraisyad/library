import { BadRequestException } from '@nestjs/common';
import { mock, mockClear } from 'jest-mock-extended';
import { BorrowingUseCase } from '../../use-cases/borrowing.use-case';
import { BorrowingController } from '../borrowing.controller';
import { validateCreateBorrowingDto } from '../../models/create-borrowing.dto';

jest.mock('../../use-cases/borrowing.use-case');
jest.mock('../../models/create-borrowing.dto');
jest.mock('../../../commons/functions/json-api-deserialize');

describe('BorrowingController', () => {
  let borrowingController: BorrowingController;
  const borrowingUseCase = mock<BorrowingUseCase>();

  beforeEach(() => {
    borrowingController = new BorrowingController(borrowingUseCase);
  });

  afterEach(() => {
    mockClear(borrowingUseCase);
  });

  describe('createBorrowing', () => {
    it('should throw BadRequestException if validation fails', async () => {
      const payload = {};
      const validationErrors = [{ field: 'field', message: 'message' }];

      (validateCreateBorrowingDto as jest.Mock).mockReturnValue({
        errors: validationErrors,
      });

      await expect(
        borrowingController.createBorrowing(payload),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
