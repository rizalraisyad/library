import { BadRequestException } from '@nestjs/common';
import { BookController } from '../book.controller';
import { BookUseCase } from '../../use-cases/book.use-case';
import { mock, mockClear } from 'jest-mock-extended';
import {
  CreateBookDto,
  validateCreateBookDto,
} from '../../models/create-book.dto';
import { Book } from '../../entities/book.entity';
import { jsonApiDeserialize } from 'src/domains/commons/functions/json-api-deserialize';
import { toJsonApi } from 'src/domains/commons/functions/to-json-api';

jest.mock('../../../commons/functions/json-api-deserialize');
jest.mock('../../models/create-book.dto');

describe('BookController', () => {
  let bookController: BookController;
  const bookUseCase = mock<BookUseCase>();

  beforeEach(() => {
    bookController = new BookController(bookUseCase);
  });

  afterEach(() => {
    mockClear(bookUseCase);
  });

  describe('createBook', () => {
    it('should create a book successfully', async () => {
      const payload = {
        data: {
          type: 'book',
          attributes: {
            title: 'Title',
            author: 'Author',
            stock: 10,
            code: 'T1',
          },
        },
      };
      const input: CreateBookDto = {
        title: 'Title',
        author: 'Author',
        stock: 10,
        code: 'T1',
      };
      const book = {
        id: '1',
        title: 'Title',
        author: 'Author',
        stock: 10,
        code: 'T1',
        availableQuantity: 10,
        borrowedQuantity: 0,
      } as Book;

      (jsonApiDeserialize as jest.Mock).mockReturnValue(input);
      (validateCreateBookDto as jest.Mock).mockReturnValue({ errors: [] });
      (bookUseCase.createBook as jest.Mock).mockResolvedValue(book);

      const result = await bookController.createBook(payload);

      expect(jsonApiDeserialize).toHaveBeenCalledWith(payload);
      expect(validateCreateBookDto).toHaveBeenCalledWith(input);
      expect(bookUseCase.createBook).toHaveBeenCalledWith(input);
      expect(result).toEqual(toJsonApi(book));
    });

    it('should throw BadRequestException if validation fails', async () => {
      const payload = {
        data: {
          type: 'book',
          attributes: {
            title: 'Title',
            author: 'Author',
            stock: 10,
            code: 'T1',
          },
        },
      };
      const input: CreateBookDto = {
        title: '',
        author: 'Author',
        stock: 10,
        code: 'T1',
      };
      const validationError = {
        errors: [{ field: 'title', message: 'Title is required' }],
      };

      (jsonApiDeserialize as jest.Mock).mockReturnValue(input);
      (validateCreateBookDto as jest.Mock).mockReturnValue(validationError);

      await expect(bookController.createBook(payload)).rejects.toThrow(
        BadRequestException,
      );
      await expect(bookController.createBook(payload)).rejects.toThrow(
        expect.objectContaining({ response: validationError }),
      );

      expect(jsonApiDeserialize).toHaveBeenCalledWith(payload);
      expect(validateCreateBookDto).toHaveBeenCalledWith(input);
      expect(bookUseCase.createBook).not.toHaveBeenCalled();
    });
  });

  describe('getBook', () => {
    it('should return book list successfully', async () => {
      const books = [
        {
          id: '1',
          title: 'Book 1',
          author: 'Author 1',
          stock: 10,
          code: 'B1',
          availableQuantity: 10,
          borrowedQuantity: 0,
        },
      ] as Book[];

      (bookUseCase.getBook as jest.Mock).mockResolvedValue(books);

      const result = await bookController.book();

      expect(bookUseCase.getBook).toHaveBeenCalled();
      expect(result).toEqual(toJsonApi(books));
    });
  });
});
