import { BaseRepository } from 'src/domains/commons/repositories';
import { Member } from '../../entities/member.entity';

export interface IMemberRepository extends BaseRepository<Member> {
  findMemberByCode(code: string): Promise<Member[]>;
  saveMember(member: Member): Promise<Member>;
}
