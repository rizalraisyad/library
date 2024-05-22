import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
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
  async createMember(@Body() payload: unknown): Promise<Member> {
    const input = jsonApiDeserialize<CreateMemberDto>(payload);

    const er = validateCreateMemberDto(input);
    if (er.errors.length > 0) {
      throw new BadRequestException(er);
    }

    const book = await this.memberUseCase.createMember(input);
    return book;
  }
}
