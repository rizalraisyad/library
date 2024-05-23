import { Inject, Injectable } from '@nestjs/common';
import { BORROWING_REPO } from '../borrowing.constant';
import { Borrowing } from '../entity/borrowing.entity';
import { IBorrowingRepository } from '../repositories/interfaces/borrowing.repositry.interface';

@Injectable()
export class BorrowingService {
  constructor(
    @Inject(BORROWING_REPO)
    private readonly borrowingRepo: IBorrowingRepository,
  ) {}

  async saveBorrowing(input: Borrowing): Promise<Borrowing> {
    return await this.borrowingRepo.saveBorrowing(input);
  }

  async findBorrowing(
    memberId?: string,
    bookId?: string,
    isReturn?: boolean,
  ): Promise<Borrowing[]> {
    return await this.borrowingRepo.findBorrowingList(
      memberId,
      bookId,
      isReturn,
    );
  }

  async countActiveBorrowings(memberId: string): Promise<number> {
    return await this.borrowingRepo.countActiveBorrowings(memberId);
  }
}
