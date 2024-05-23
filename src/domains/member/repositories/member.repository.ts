import { Injectable } from '@nestjs/common';
import { AbstractBaseRepository } from 'src/domains/commons/repositories';
import { EntityManager } from 'typeorm';
import { Member } from '../entities/member.entity';
import { IMemberRepository } from './interfaces/member.repository.interface';

@Injectable()
export class MemberRepository
  extends AbstractBaseRepository<Member>
  implements IMemberRepository
{
  constructor(manager: EntityManager) {
    super(manager, Member);
  }
  async findMembersWithBorrowingCount(): Promise<Member[]> {
    const qb = this.manager.createQueryBuilder(this.Entity, 'member');
    qb.leftJoinAndSelect(
      'member.borrowingList',
      'borrowing',
      'borrowing.isReturned = :isReturned',
      { isReturned: false },
    )
      .select([
        'member.id',
        'member.code',
        'member.name',
        'member.penaltyStatus',
        'member.penaltyEndDate',
        'COUNT(borrowing.id) AS borrowingCount',
      ])
      .groupBy('member.id')
      .addGroupBy('member.code')
      .addGroupBy('member.name')
      .addGroupBy('member.penaltyStatus')
      .addGroupBy('member.penaltyEndDate');

    const res = await qb.getRawMany();
    return res;
  }

  async findMemberById(id: string): Promise<Member> {
    const qb = this.manager.createQueryBuilder(this.Entity, 'm');
    qb.where('m.id::text = :id', { id: id });

    return await qb.getOne();
  }
  async findMemberByCode(code: string): Promise<Member[]> {
    const qb = this.manager.createQueryBuilder(this.Entity, 'm');
    qb.where('m.code like :code', { code: code });

    return await qb.getMany();
  }

  async saveMember(member: Member): Promise<Member> {
    const res = await this.saveOne(member);
    return res;
  }
}
