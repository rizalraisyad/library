import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BOOK_REPO } from '../book.constant';
import { Book } from '../entities/book.entity';
import { IBookRepository } from '../repositories/interfaces/book.repository.interface';

@Injectable()
export class BookService {
  constructor(
    @Inject(BOOK_REPO)
    private readonly bookRepo: IBookRepository,
  ) {}

  async createBook(input: Book): Promise<Book> {
    return await this.bookRepo.saveBook(input);
  }

  async findBooks(): Promise<Book[]> {
    return await this.bookRepo.findBooks();
  }

  async findBookByCode(code: string): Promise<Book> {
    return await this.bookRepo.findBookByCode(code);
  }

  async findBookById(bookId: string): Promise<Book> {
    return await this.bookRepo.findBookById(bookId);
  }

  async decrementStockAvailabilityAndIncrementBorrowedQty(
    bookId: string,
  ): Promise<void> {
    const book = await this.bookRepo.findBookById(bookId);
    if (!book) {
      throw new BadRequestException(`Book with id: ${bookId} not found.`);
    }
    if (book.availableQuantity <= 0) {
      throw new BadRequestException(`Book with id: ${bookId} is out of stock.`);
    }
    book.availableQuantity -= 1;
    book.borrowedQuantity += 1;

    await this.bookRepo.saveOne(book);
  }

  async incrementStockAvailabilityAndDecrementBorrowedQty(
    bookId: string,
  ): Promise<void> {
    const book = await this.bookRepo.findBookById(bookId);
    if (!book) {
      throw new BadRequestException(`Book with id: ${bookId} not found.`);
    }

    book.availableQuantity += 1;
    book.borrowedQuantity -= 1;

    await this.bookRepo.saveOne(book);
  }
}
