import { BadRequestException } from '@nestjs/common';
import { mock, mockClear } from 'jest-mock-extended';
import { jsonApiDeserialize } from 'src/domains/commons/functions/json-api-deserialize';
import { toJsonApi } from 'src/domains/commons/functions/to-json-api';
import { Member } from '../../entities/member.entity';
import {
  CreateMemberDto,
  validateCreateMemberDto,
} from '../../models/create-member.dto';
import { MemberUseCase } from '../../use-cases/member.use-case';
import { MemberController } from '../member.controller';

jest.mock('../../../commons/functions/json-api-deserialize');
jest.mock('../../models/create-member.dto');

describe('MemberController', () => {
  let memberController: MemberController;
  const memberUseCase = mock<MemberUseCase>();

  beforeEach(() => {
    memberController = new MemberController(memberUseCase);
  });

  afterEach(() => {
    mockClear(memberUseCase);
  });

  describe('createMember', () => {
    it('should create a book successfully', async () => {
      const payload = {
        data: {
          type: 'book',
          attributes: {
            title: 'Title',
            author: 'Author',
            stock: 10,
            code: 'T1',
          },
        },
      };
      const input: CreateMemberDto = {
        code: 'T',
        name: 'T',
      };
      const book = {
        code: 'T',
      } as Member;

      (jsonApiDeserialize as jest.Mock).mockReturnValue(input);
      (validateCreateMemberDto as jest.Mock).mockReturnValue({ errors: [] });
      (memberUseCase.createMember as jest.Mock).mockResolvedValue(book);

      const result = await memberController.createMember(payload);

      expect(jsonApiDeserialize).toHaveBeenCalledWith(payload);
      expect(validateCreateMemberDto).toHaveBeenCalledWith(input);
      expect(memberUseCase.createMember).toHaveBeenCalledWith(input);
      expect(result).toEqual(toJsonApi(book));
    });

    it('should throw BadRequestException if validation fails', async () => {
      const payload = {
        data: {
          type: 'book',
          attributes: {
            title: 'Title',
            author: 'Author',
            stock: 10,
            code: 'T1',
          },
        },
      };
      const input: CreateMemberDto = {
        code: 'T',
        name: 'T',
      };
      const validationError = {
        errors: [{ field: 'title', message: 'Title is required' }],
      };

      (jsonApiDeserialize as jest.Mock).mockReturnValue(input);
      (validateCreateMemberDto as jest.Mock).mockReturnValue(validationError);

      await expect(memberController.createMember(payload)).rejects.toThrow(
        BadRequestException,
      );
      await expect(memberController.createMember(payload)).rejects.toThrow(
        expect.objectContaining({ response: validationError }),
      );

      expect(jsonApiDeserialize).toHaveBeenCalledWith(payload);
      expect(validateCreateMemberDto).toHaveBeenCalledWith(input);
      expect(memberUseCase.createMember).not.toHaveBeenCalled();
    });
  });

  describe('getMember', () => {
    it('should return a list of members', async () => {
      const members = [new Member({}), new Member({}), new Member({})];
      jest
        .spyOn(memberUseCase, 'getMemberWithBorrowingCount')
        .mockResolvedValue(members);

      const result = await memberController.members();

      expect(result).toEqual(toJsonApi(members));
    });
  });
});
