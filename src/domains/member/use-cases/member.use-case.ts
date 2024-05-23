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

    return this.memberService.saveMember(book);
  }

  async getMemberWithBorrowingCount(): Promise<Member[]> {
    return this.memberService.findMembersWithBorrowingCount();
  }

  async validateMemberStatus(member: Member): Promise<Member> {
    if (member.penaltyStatus || member.penaltyEndDate) {
      if (member.isMemberUnderPenalty()) {
        member.penaltyStatus = false;
        member.penaltyEndDate = null;
        const validatedMember = await this.memberService.saveMember(member);
        return validatedMember;
      }
    }

    return member;
  }

  async isMemberBeingPenalized(id: string): Promise<boolean> {
    const member = await this.memberService.findMemberById(id);
    if (member === null) {
      const errorResp = new ErrorResponse();
      errorResp.errors = [];
      const newErr = new ErrorObject();
      (newErr.title = 'Validate Member Failed'),
        (newErr.detail = `Member with code: ${id} not found`);
      errorResp.errors.push(newErr);
      throw new BadRequestException(errorResp);
    }
    const validateMember = await this.validateMemberStatus(member);
    return validateMember.penaltyStatus;
  }

  async applyPenalty(memberId: string): Promise<Member> {
    const member = await this.memberService.findMemberById(memberId);
    member.applyPenalty();
    return await this.memberService.saveMember(member);
  }
}
