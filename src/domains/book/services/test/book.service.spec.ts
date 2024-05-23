import { BookService } from '../book.service';
import { mock, mockClear } from 'jest-mock-extended';
import { Book } from '../../entities/book.entity';
import { BookRepository } from '../../repositories/book.repository';
import { BadRequestException } from '@nestjs/common';

describe('BookUseCase', () => {
  let bookService: BookService;
  const bookRepository = mock<BookRepository>();

  beforeEach(() => {
    bookService = new BookService(bookRepository);
  });

  afterEach(() => {
    mockClear(bookRepository);
  });

  describe('createBook', () => {
    it('should createBook into database', async () => {
      const responseBook = {
        author: 'Horizon',
        title: 'Title',
        stock: 1,
        code: 'T1',
        id: 'testID',
        availableQuantity: 1,
        borrowedQuantity: 0,
      } as Book;
      jest.spyOn(bookRepository, 'saveBook').mockResolvedValue(responseBook);

      expect(await bookService.createBook(responseBook)).toBe(responseBook);
    });
  });

  describe('findBookByCode', () => {
    it('should createBook into database', async () => {
      const responseBook = {
        author: 'Horizon',
        title: 'Title',
        stock: 1,
        code: 'T1',
        id: 'testID',
        availableQuantity: 1,
        borrowedQuantity: 0,
      } as Book;
      jest
        .spyOn(bookRepository, 'findBookByCode')
        .mockResolvedValue(responseBook);

      expect(await bookService.findBookByCode(responseBook.code)).toStrictEqual(
        responseBook,
      );
    });
  });

  describe('findBookById', () => {
    it('should return a book with the given ID', async () => {
      const bookId = '1';
      const book = new Book({});
      jest.spyOn(bookRepository, 'findBookById').mockResolvedValue(book);

      expect(await bookService.findBookById(bookId)).toBe(book);
    });
  });

  describe('incrementStockAvailabilityAndDecrementBorrowedQty', () => {
    it('should increment stock and decrement borrowed quantity for a book', async () => {
      const bookId = '1';
      const book = new Book({});
      book.borrowedQuantity = 1;
      book.availableQuantity = 1;
      jest.spyOn(bookRepository, 'findBookById').mockResolvedValue(book);
      jest.spyOn(bookRepository, 'saveOne').mockResolvedValue(undefined);

      await expect(
        bookService.incrementStockAvailabilityAndDecrementBorrowedQty(bookId),
      ).resolves.not.toThrow();
      expect(book.availableQuantity).toBe(2);
      expect(book.borrowedQuantity).toBe(0);
    });

    it('should throw BadRequestException if book not found', async () => {
      const bookId = '1';
      jest.spyOn(bookRepository, 'findBookById').mockResolvedValue(undefined);

      await expect(
        bookService.incrementStockAvailabilityAndDecrementBorrowedQty(bookId),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('decrementStockAvailabilityAndIncrementBorrowedQty', () => {
    it('should decrement stock and increment borrowed quantity for a book', async () => {
      const bookId = '1';
      const book = new Book({});
      book.availableQuantity = 1;
      book.borrowedQuantity = 0;
      jest.spyOn(bookRepository, 'findBookById').mockResolvedValue(book);
      jest.spyOn(bookRepository, 'saveOne').mockResolvedValue(undefined);

      await expect(
        bookService.decrementStockAvailabilityAndIncrementBorrowedQty(bookId),
      ).resolves.not.toThrow();
      expect(book.availableQuantity).toBe(0);
      expect(book.borrowedQuantity).toBe(1);
    });

    it('should throw BadRequestException if book not found', async () => {
      const bookId = '1';
      jest.spyOn(bookRepository, 'findBookById').mockResolvedValue(undefined);

      await expect(
        bookService.decrementStockAvailabilityAndIncrementBorrowedQty(bookId),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if book is out of stock', async () => {
      const bookId = '1';
      const book = new Book({});
      book.availableQuantity = 0;
      jest.spyOn(bookRepository, 'findBookById').mockResolvedValue(book);

      await expect(
        bookService.decrementStockAvailabilityAndIncrementBorrowedQty(bookId),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
