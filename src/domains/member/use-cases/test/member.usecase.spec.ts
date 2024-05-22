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
      jest
        .spyOn(memberService, 'createMember')
        .mockResolvedValue(responseMember);

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
});
