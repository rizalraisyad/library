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
import { Member } from '../entities/member.entity';
import { MEMBER_USECASE } from '../member.constant';
import {
  CreateMemberDto,
  validateCreateMemberDto,
} from '../models/create-member.dto';
import { MemberUseCase } from '../use-cases/member.use-case';

@Controller()
export class MemberController {
  constructor(
    @Inject(MEMBER_USECASE)
    private readonly memberUseCase: MemberUseCase,
  ) {}

  @Post('/member')
  async createMember(
    @Body() payload: unknown,
  ): Promise<JsonApiResponse<Member>> {
    const input = jsonApiDeserialize<CreateMemberDto>(payload);

    const er = validateCreateMemberDto(input);
    if (er.errors.length > 0) {
      throw new BadRequestException(er);
    }

    const book = await this.memberUseCase.createMember(input);
    return toJsonApi(book);
  }

  @Get('/members')
  async members(): Promise<JsonApiResponse<Member[]>> {
    const book = await this.memberUseCase.getMemberWithBorrowingCount();
    return toJsonApi(book);
  }
}
