import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ErrorObject, ErrorResponse } from 'src/exceptions/models/error-object';
import { Member } from '../entities/member.entity';
import { MEMBER_SERVICE } from '../member.constant';
import { CreateMemberDto } from '../models/create-member.dto';
import { MemberService } from '../services/member.service';

@Injectable()
export class MemberUseCase {
  constructor(
    @Inject(MEMBER_SERVICE)
    private readonly memberService: MemberService,
  ) {}

  async validateMemberExistence(
    input: CreateMemberDto,
  ): Promise<ErrorResponse | string> {
    const members = await this.memberService.findMemberByCode(input.code);

    const errorResp = new ErrorResponse();
    errorResp.errors = [];

    if (members.length > 0) {
      const newErr = new ErrorObject();
      (newErr.title = 'Create Member Failed'),
        (newErr.detail = `Member with code: ${input.code} already exist`);
      errorResp.errors.push(newErr);
    }

    if (errorResp.errors.length > 0) {
      throw new BadRequestException(errorResp);
    }
    return null;
  }

  async createMember(input: CreateMemberDto): Promise<Member> {
    await this.validateMemberExistence(input);
    const book = new Member({});
    book.createFromDto(input);

    return this.memberService.createMember(book);
  }
}
