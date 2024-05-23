import { Injectable } from '@nestjs/common';
import { AbstractBaseRepository } from 'src/domains/commons/repositories';
import { EntityManager } from 'typeorm';
import { Borrowing } from '../entity/borrowing.entity';
import { IBorrowingRepository } from './interfaces/borrowing.repositry.interface';

@Injectable()
export class BorrowingRepository
  extends AbstractBaseRepository<Borrowing>
  implements IBorrowingRepository
{
  constructor(manager: EntityManager) {
    super(manager, Borrowing);
  }
  async findBorrowingList(
    memberId?: string,
    bookId?: string,
    isReturn?: boolean,
  ): Promise<Borrowing[]> {
    const qb = this.manager.createQueryBuilder(this.Entity, 'b');

    if (memberId) {
      qb.andWhere('b.member_id::text like :memberId', { memberId: memberId });
    }

    if (bookId) {
      qb.andWhere('b.book_id::text like :bookId', { bookId: bookId });
    }

    if (isReturn !== undefined) {
      qb.andWhere('b.is_returned = :isReturn', { isReturn: isReturn });
    }

    qb.leftJoinAndSelect('b.bookId', 'book');
    qb.leftJoinAndSelect('b.memberId', 'member');
    return await qb.getMany();
  }

  async saveBorrowing(borrowing: Borrowing): Promise<Borrowing> {
    const res = await this.saveOne(borrowing);
    return res;
  }

  async countActiveBorrowings(memberId: string): Promise<number> {
    return await this.createQueryBuilder('b')
      .where('b.is_returned = :isReturned', { isReturned: false })
      .andWhere('b.member_id::text like :memberId', { memberId: memberId })
      .getCount();
  }
}
