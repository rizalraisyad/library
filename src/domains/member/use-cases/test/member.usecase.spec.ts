import { mock, mockClear } from 'jest-mock-extended';
import { BadRequestException } from '@nestjs/common';
import { ErrorObject, ErrorResponse } from 'src/exceptions/models/error-object';
import { MemberUseCase } from '../member.use-case';
import { MemberService } from '../../services/member.service';
import { CreateMemberDto } from '../../models/create-member.dto';
import { Member } from '../../entities/member.entity';

describe('MemberUseCase', () => {
  let memberUseCase: MemberUseCase;
  const memberService = mock<MemberService>();

  beforeEach(() => {
    memberUseCase = new MemberUseCase(memberService);
  });

  afterEach(() => {
    mockClear(memberService);
  });

  describe('createMember', () => {
    it('should createMember into database', async () => {
      const inputMember = {
        code: 'T',
      } as CreateMemberDto;

      const responseMember = {
        code: 'T',
      } as Member;
      jest.spyOn(memberService, 'findMemberByCode').mockResolvedValue([]);
      jest.spyOn(memberService, 'saveMember').mockResolvedValue(responseMember);

      expect(await memberUseCase.createMember(inputMember)).toBe(
        responseMember,
      );
    });

    it('should return error duplicate code', async () => {
      const inputMember = {
        code: 'T',
      } as CreateMemberDto;

      const responseMember = {
        code: 'T',
      } as Member;

      const expectedErrorResponse = new ErrorResponse();
      const newErr = new ErrorObject();
      newErr.title = 'Create Member Failed';
      newErr.detail = `Member with code: ${inputMember.code} already exist`;
      expectedErrorResponse.errors = [newErr];

      jest
        .spyOn(memberService, 'findMemberByCode')
        .mockResolvedValue([responseMember]);

      await expect(memberUseCase.createMember(inputMember)).rejects.toThrow(
        BadRequestException,
      );

      try {
        await memberUseCase.createMember(inputMember);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.response).toEqual(expectedErrorResponse);
      }
    });
  });

  describe('validateMemberStatus', () => {
    it('should validate member status and remove penalty if applicable', async () => {
      const member = new Member({});
      member.penaltyStatus = true;
      member.penaltyEndDate = new Date(Date.now() - 86400000);
      jest.spyOn(memberService, 'saveMember').mockResolvedValue(member);

      const result = await memberUseCase.validateMemberStatus(member);

      expect(result.penaltyStatus).toBe(false);
      expect(result.penaltyEndDate).toBe(null);
    });

    it('should not remove penalty if member is still under penalty', async () => {
      const member = new Member({});
      member.penaltyStatus = true;
      member.penaltyEndDate = new Date(Date.now() + 86400000); // Penalty ends tomorrow
      jest.spyOn(memberService, 'saveMember').mockResolvedValue(member);

      const result = await memberUseCase.validateMemberStatus(member);

      expect(result.penaltyStatus).toBe(true);
      expect(result.penaltyEndDate).not.toBe(null);
    });
  });

  describe('applyPenalty', () => {
    it('should apply penalty to a member', async () => {
      const memberId = '1';
      const member = new Member({});
      jest.spyOn(memberService, 'findMemberById').mockResolvedValue(member);
      jest.spyOn(member, 'applyPenalty');
      jest.spyOn(memberService, 'saveMember').mockResolvedValue(member);

      const result = await memberUseCase.applyPenalty(memberId);

      expect(member.applyPenalty).toHaveBeenCalled();
      expect(result).toEqual(member);
    });
  });

  describe('isMemberBeingPenalized', () => {
    it('should return true if member is being penalized', async () => {
      const memberId = '1';
      const member = new Member({});
      member.penaltyStatus = true;
      jest.spyOn(memberService, 'findMemberById').mockResolvedValue(member);
      jest
        .spyOn(memberUseCase, 'validateMemberStatus')
        .mockResolvedValue(member);

      const result = await memberUseCase.isMemberBeingPenalized(memberId);

      expect(result).toBe(true);
    });

    it('should return false if member is not being penalized', async () => {
      const memberId = '1';
      const member = new Member({});
      member.penaltyStatus = false;
      jest.spyOn(memberService, 'findMemberById').mockResolvedValue(member);
      jest
        .spyOn(memberUseCase, 'validateMemberStatus')
        .mockResolvedValue(member);

      const result = await memberUseCase.isMemberBeingPenalized(memberId);

      expect(result).toBe(false);
    });
  });

  describe('getMemberWithBorrowingCount', () => {
    it('should return a list of members with borrowing count', async () => {
      const members = [new Member({}), new Member({}), new Member({})];
      jest
        .spyOn(memberService, 'findMembersWithBorrowingCount')
        .mockResolvedValue(members);

      const result = await memberUseCase.getMemberWithBorrowingCount();

      expect(result).toEqual(members);
    });
  });
});
