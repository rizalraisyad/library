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

      expect(await memberService.saveMember(responseMember)).toBe(
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

  describe('findMemberById', () => {
    it('should return a member with the given id', async () => {
      const memberId = '1';
      const member = new Member({});
      jest.spyOn(memberRepository, 'findMemberById').mockResolvedValue(member);

      const result = await memberService.findMemberById(memberId);

      expect(result).toEqual(member);
    });

    it('should return null if no member is found with the given id', async () => {
      const memberId = '1';
      jest.spyOn(memberRepository, 'findMemberById').mockResolvedValue(null);

      const result = await memberService.findMemberById(memberId);

      expect(result).toBeNull();
    });
  });

  describe('findMembersWithBorrowingCount', () => {
    it('should return a list of members with borrowing count', async () => {
      const members = [new Member({}), new Member({}), new Member({})];
      jest
        .spyOn(memberRepository, 'findMembersWithBorrowingCount')
        .mockResolvedValue(members);

      const result = await memberService.findMembersWithBorrowingCount();

      expect(result).toEqual(members);
    });
  });
});
