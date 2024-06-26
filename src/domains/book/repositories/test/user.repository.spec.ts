import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { Book } from '../../entities/book.entity';
import { BookRepository } from '../book.repository';

describe('BookRepository', () => {
  let bookRepository: BookRepository;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookRepository,
        {
          provide: EntityManager,
          useValue: {
            createQueryBuilder: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    bookRepository = module.get<BookRepository>(BookRepository);
    manager = module.get<EntityManager>(EntityManager);
  });

  describe('findBookByCode', () => {
    it('should return books with the given code', async () => {
      const code = 'T1';
      const book = new Book({});
      book.code = code;
      const queryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue([book]),
      };

      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const result = await bookRepository.findBookByCode(code);

      expect(manager.createQueryBuilder).toHaveBeenCalledWith(Book, 'b');
      expect(queryBuilder.where).toHaveBeenCalledWith('b.code like :code', {
        code,
      });
      expect(result).toEqual([book]);
    });
  });

  describe('saveBook', () => {
    it('should save the book and return the saved entity', async () => {
      const book = new Book({});
      book.code = 'T1';

      jest.spyOn(bookRepository, 'saveOne').mockResolvedValue(book);

      const result = await bookRepository.saveBook(book);

      expect(bookRepository.saveOne).toHaveBeenCalledWith(book);
      expect(result).toEqual(book);
    });
  });

  describe('findBooks', () => {
    it('should return all books', async () => {
      const books = [new Book({}), new Book({}), new Book({})];
      const queryBuilder: any = {
        getMany: jest.fn().mockResolvedValue(books),
      };
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const result = await bookRepository.findBooks();

      expect(manager.createQueryBuilder).toHaveBeenCalledWith(Book, 'b');
      expect(result).toEqual(books);
    });
  });

  describe('findBookById', () => {
    it('should return a book with the given ID', async () => {
      const bookId = '1';
      const book = new Book({});
      const queryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(book),
      };
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const result = await bookRepository.findBookById(bookId);

      expect(manager.createQueryBuilder).toHaveBeenCalledWith(Book, 'b');
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'b.id::text like :bookId',
        { bookId },
      );
      expect(result).toEqual(book);
    });
  });
});
