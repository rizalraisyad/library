import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import { toJsonApi } from 'src/domains/commons/functions/to-json-api';
import { JsonApiResponse } from 'src/domains/commons/models/json-api-response';
import { jsonApiDeserialize } from '../../commons/functions/json-api-deserialize';
import { BORROWING_USECASE } from '../borrowing.constant';
import { Borrowing } from '../entity/borrowing.entity';
import {
  CreateBorrowingDto,
  validateCreateBorrowingDto,
} from '../models/create-borrowing.dto';
import { BorrowingUseCase } from '../use-cases/borrowing.use-case';

@Controller()
export class BorrowingController {
  constructor(
    @Inject(BORROWING_USECASE)
    private readonly borrowingUseCase: BorrowingUseCase,
  ) {}

  @Post('/borrowing')
  async createBorrowing(
    @Body() payload: unknown,
  ): Promise<JsonApiResponse<Borrowing>> {
    const input = jsonApiDeserialize<CreateBorrowingDto>(payload);

    const er = validateCreateBorrowingDto(input);
    if (er.errors.length > 0) {
      throw new BadRequestException(er);
    }

    const book = await this.borrowingUseCase.createBorrowingTransaction(input);
    return toJsonApi(book);
  }

  @Post('/borrowing/return')
  async returnBorrowing(
    @Body() payload: unknown,
  ): Promise<JsonApiResponse<Borrowing>> {
    const input = jsonApiDeserialize<CreateBorrowingDto>(payload);

    const er = validateCreateBorrowingDto(input);
    if (er.errors.length > 0) {
      throw new BadRequestException(er);
    }

    const book = await this.borrowingUseCase.returnBorrowingTransaction(input);
    return toJsonApi(book);
  }
}
