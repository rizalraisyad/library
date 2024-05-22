import { Body, Controller, Post } from '@nestjs/common';
import { jsonApiDeserialize } from '../../commons/functions/json-api-deserialize';
import { Book } from '../entities/book.entity';
import { CreateBookDto } from '../models/create-book.dto';

@Controller()
export class BookController {
  constructor() {}

  @Post('/book')
  async createUser(@Body() payload: unknown): Promise<Book> {
    const input = jsonApiDeserialize<CreateBookDto>(payload);
    console.log(input);

    return;
  }
}
