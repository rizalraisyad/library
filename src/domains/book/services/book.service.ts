import { Inject, Injectable } from '@nestjs/common';
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

  async findBookByCode(code: string): Promise<Book[]> {
    return await this.bookRepo.findBookByCode(code);
  }
}
