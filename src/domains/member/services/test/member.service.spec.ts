import { mock, mockClear } from 'jest-mock-extended';
import { Member } from '../../entities/member.entity';
import { MemberRepository } from '../../repositories/member.repository';
import { MemberService } from '../member.service';

describe('MemberUseCase', () => {
  let memberService: MemberService;
  const memberRepository = mock<MemberRepository>();

  beforeEach(() => {
    memberService = new MemberService(memberRepository);
  });

  afterEach(() => {
    mockClear(memberRepository);
  });

  describe('createMember', () => {
    it('should createMember into database', async () => {
      const responseMember = {
        code: 'T',
      } as Member;
      jest
        .spyOn(memberRepository, 'saveMember')
        .mockResolvedValue(responseMember);

      expect(await memberService.createMember(responseMember)).toBe(
        responseMember,
      );
    });
  });

  describe('findMemberByCode', () => {
    it('should createMember into database', async () => {
      const responseMember = {
        code: 'T',
      } as Member;
      jest
        .spyOn(memberRepository, 'findMemberByCode')
        .mockResolvedValue([responseMember]);

      expect(
        await memberService.findMemberByCode(responseMember.code),
      ).toStrictEqual([responseMember]);
    });
  });
});
