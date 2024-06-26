import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
} from '@nestjs/common';
import { toJsonApi } from 'src/domains/commons/functions/to-json-api';
import { JsonApiResponse } from 'src/domains/commons/models/json-api-response';
import { jsonApiDeserialize } from '../../commons/functions/json-api-deserialize';
import { BOOK_USECASE } from '../book.constant';
import { Book } from '../entities/book.entity';
import {
  CreateBookDto,
  validateCreateBookDto,
} from '../models/create-book.dto';
import { BookUseCase } from '../use-cases/book.use-case';

@Controller()
export class BookController {
  constructor(
    @Inject(BOOK_USECASE)
    private readonly bookUseCase: BookUseCase,
  ) {}

  @Post('/book')
  async createBook(@Body() payload: unknown): Promise<JsonApiResponse<Book>> {
    const input = jsonApiDeserialize<CreateBookDto>(payload);

    const er = validateCreateBookDto(input);
    if (er.errors.length > 0) {
      throw new BadRequestException(er);
    }

    const book = await this.bookUseCase.createBook(input);
    return toJsonApi(book);
  }

  @Get('/books')
  async book(): Promise<JsonApiResponse<Book[]>> {
    const book = await this.bookUseCase.getBook();
    return toJsonApi(book);
  }
}
