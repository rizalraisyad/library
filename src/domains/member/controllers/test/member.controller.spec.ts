import { BadRequestException } from '@nestjs/common';
import { mock, mockClear } from 'jest-mock-extended';
import { jsonApiDeserialize } from 'src/domains/commons/functions/json-api-deserialize';
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
  let bookController: MemberController;
  const bookUseCase = mock<MemberUseCase>();

  beforeEach(() => {
    bookController = new MemberController(bookUseCase);
  });

  afterEach(() => {
    mockClear(bookUseCase);
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
      (bookUseCase.createMember as jest.Mock).mockResolvedValue(book);

      const result = await bookController.createMember(payload);

      expect(jsonApiDeserialize).toHaveBeenCalledWith(payload);
      expect(validateCreateMemberDto).toHaveBeenCalledWith(input);
      expect(bookUseCase.createMember).toHaveBeenCalledWith(input);
      expect(result).toEqual(book);
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

      await expect(bookController.createMember(payload)).rejects.toThrow(
        BadRequestException,
      );
      await expect(bookController.createMember(payload)).rejects.toThrow(
        expect.objectContaining({ response: validationError }),
      );

      expect(jsonApiDeserialize).toHaveBeenCalledWith(payload);
      expect(validateCreateMemberDto).toHaveBeenCalledWith(input);
      expect(bookUseCase.createMember).not.toHaveBeenCalled();
    });
  });
});
