import { BaseRepository } from 'src/domains/commons/repositories';
import { Borrowing } from '../../entity/borrowing.entity';

export interface IBorrowingRepository extends BaseRepository<Borrowing> {
  findBorrowingList(
    memberId?: string,
    bookId?: string,
    isReturn?: boolean,
  ): Promise<Borrowing[]>;
  saveBorrowing(borrowing: Borrowing): Promise<Borrowing>;
  countActiveBorrowings(memberId: string): Promise<number>;
}
