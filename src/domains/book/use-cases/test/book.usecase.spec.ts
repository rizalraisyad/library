import { BookService } from '../../services/book.service';
import { BookUseCase } from '../book.use-case';
import { mock, mockClear } from 'jest-mock-extended';
import { CreateBookDto } from '../../models/create-book.dto';
import { Book } from '../../entities/book.entity';
import { BadRequestException } from '@nestjs/common';
import { ErrorObject, ErrorResponse } from 'src/exceptions/models/error-object';

describe('BookUseCase', () => {
  let bookUseCase: BookUseCase;
  const bookService = mock<BookService>();

  beforeEach(() => {
    bookUseCase = new BookUseCase(bookService);
  });

  afterEach(() => {
    mockClear(bookService);
  });

  describe('createBook', () => {
    it('should createBook into database', async () => {
      const inputBook = {
        author: 'Horizon',
        title: 'Title',
        stock: 1,
        code: 'T1',
      } as CreateBookDto;

      const responseBook = {
        author: 'Horizon',
        title: 'Title',
        stock: 1,
        code: 'T1',
        id: 'testID',
        availableQuantity: 1,
        borrowedQuantity: 0,
      } as Book;
      jest.spyOn(bookService, 'findBookByCode').mockResolvedValue([]);
      jest.spyOn(bookService, 'createBook').mockResolvedValue(responseBook);

      expect(await bookUseCase.createBook(inputBook)).toBe(responseBook);
    });

    it('should return error duplicate code', async () => {
      const inputBook = {
        author: 'Horizon',
        title: 'Title',
        stock: 1,
        code: 'T1',
      } as CreateBookDto;

      const responseBook = {
        author: 'Horizon',
        title: 'Title',
        stock: 1,
        code: 'T1',
        id: 'testID',
        availableQuantity: 1,
        borrowedQuantity: 0,
      } as Book;

      const expectedErrorResponse = new ErrorResponse();
      const newErr = new ErrorObject();
      newErr.title = 'Create Book Failed';
      newErr.detail = `Book with code: ${inputBook.code} already exist`;
      expectedErrorResponse.errors = [newErr];

      jest
        .spyOn(bookService, 'findBookByCode')
        .mockResolvedValue([responseBook]);

      await expect(bookUseCase.createBook(inputBook)).rejects.toThrow(
        BadRequestException,
      );

      try {
        await bookUseCase.createBook(inputBook);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.response).toEqual(expectedErrorResponse);
      }
    });
  });
});
