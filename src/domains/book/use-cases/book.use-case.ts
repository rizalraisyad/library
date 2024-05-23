import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ErrorObject, ErrorResponse } from 'src/exceptions/models/error-object';
import { BOOK_SERVICE } from '../book.constant';
import { Book } from '../entities/book.entity';
import { CreateBookDto } from '../models/create-book.dto';
import { BookService } from '../services/book.service';

@Injectable()
export class BookUseCase {
  constructor(
    @Inject(BOOK_SERVICE)
    private readonly bookService: BookService,
  ) {}

  async validateBookExistence(
    input: CreateBookDto,
  ): Promise<ErrorResponse | string> {
    const books = await this.bookService.findBookByCode(input.code);

    const errorResp = new ErrorResponse();
    errorResp.errors = [];

    if (books) {
      const newErr = new ErrorObject();
      (newErr.title = 'Create Book Failed'),
        (newErr.detail = `Book with code: ${input.code} already exist`);
      errorResp.errors.push(newErr);
    }

    if (errorResp.errors.length > 0) {
      throw new BadRequestException(errorResp);
    }
    return null;
  }

  async createBook(input: CreateBookDto): Promise<Book> {
    await this.validateBookExistence(input);
    const book = new Book({});
    book.createFromDto(input);

    return this.bookService.createBook(book);
  }

  async getBook(): Promise<Book[]> {
    return this.bookService.findBooks();
  }
}
