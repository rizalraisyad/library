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

  describe('findMembersWithBorrowingCount', () => {
    it('should return a list of members with borrowing count', async () => {
      const rawResults = [
        {
          member_id: '1',
          member_code: 'T1',
          member_name: 'Test 1',
          member_penaltyStatus: false,
          member_penaltyEndDate: null,
          borrowingCount: '2',
        },
        {
          member_id: '2',
          member_code: 'T2',
          member_name: 'Test 2',
          member_penaltyStatus: true,
          member_penaltyEndDate: new Date(),
          borrowingCount: '1',
        },
      ];
      const queryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(rawResults),
      };

      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      await memberRepository.findMembersWithBorrowingCount();

      expect(manager.createQueryBuilder).toHaveBeenCalledWith(Member, 'member');
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'member.borrowingList',
        'borrowing',
        'borrowing.isReturned = :isReturned',
        { isReturned: false },
      );
      expect(queryBuilder.select).toHaveBeenCalledWith([
        'member.id',
        'member.code',
        'member.name',
        'member.penaltyStatus',
        'member.penaltyEndDate',
        'COUNT(borrowing.id) AS borrowingCount',
      ]);
      expect(queryBuilder.groupBy).toHaveBeenCalledWith('member.id');
      expect(queryBuilder.addGroupBy).toHaveBeenCalledWith('member.code');
      expect(queryBuilder.addGroupBy).toHaveBeenCalledWith('member.name');
      expect(queryBuilder.addGroupBy).toHaveBeenCalledWith(
        'member.penaltyStatus',
      );
      expect(queryBuilder.addGroupBy).toHaveBeenCalledWith(
        'member.penaltyEndDate',
      );
    });
  });
});
