import { Inject, Injectable } from '@nestjs/common';
import { Member } from '../entities/member.entity';
import { MEMBER_REPO } from '../member.constant';
import { IMemberRepository } from '../repositories/interfaces/member.repository.interface';

@Injectable()
export class MemberService {
  constructor(
    @Inject(MEMBER_REPO)
    private readonly memberRepo: IMemberRepository,
  ) {}

  async findMemberById(id: string): Promise<Member> {
    return await this.memberRepo.findMemberById(id);
  }

  async findMembersWithBorrowingCount(): Promise<Member[]> {
    return await this.memberRepo.findMembersWithBorrowingCount();
  }

  async saveMember(input: Member): Promise<Member> {
    return await this.memberRepo.saveMember(input);
  }

  async findMemberByCode(code: string): Promise<Member[]> {
    return await this.memberRepo.findMemberByCode(code);
  }
}
