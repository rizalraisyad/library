import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { Member } from '../../entities/member.entity';
import { MemberRepository } from '../member.repository';

describe('MemberRepository', () => {
  let memberRepository: MemberRepository;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberRepository,
        {
          provide: EntityManager,
          useValue: {
            createQueryBuilder: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    memberRepository = module.get<MemberRepository>(MemberRepository);
    manager = module.get<EntityManager>(EntityManager);
  });

  describe('findMemberByCode', () => {
    it('should return members with the given code', async () => {
      const code = 'T1';
      const member = new Member({});
      member.code = code;
      const queryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([member]),
      };

      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const result = await memberRepository.findMemberByCode(code);

      expect(manager.createQueryBuilder).toHaveBeenCalledWith(Member, 'm');
      expect(queryBuilder.where).toHaveBeenCalledWith('m.code like :code', {
        code,
      });
      expect(result).toEqual([member]);
    });
  });

  describe('saveMember', () => {
    it('should save the member and return the saved entity', async () => {
      const member = new Member({});
      member.code = 'T1';

      jest.spyOn(memberRepository, 'saveOne').mockResolvedValue(member);

      const result = await memberRepository.saveMember(member);

      expect(memberRepository.saveOne).toHaveBeenCalledWith(member);
      expect(result).toEqual(member);
    });
  });
});
