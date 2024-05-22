import { BookService } from '../book.service';
import { mock, mockClear } from 'jest-mock-extended';
import { Book } from '../../entities/book.entity';
import { BookRepository } from '../../repositories/book.repository';

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
        .mockResolvedValue([responseBook]);

      expect(await bookService.findBookByCode(responseBook.code)).toStrictEqual(
        [responseBook],
      );
    });
  });
});
