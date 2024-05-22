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
