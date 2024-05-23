import { mock, mockClear } from 'jest-mock-extended';
import { Borrowing } from '../../entity/borrowing.entity';
import { IBorrowingRepository } from '../../repositories/interfaces/borrowing.repositry.interface';
import { BorrowingService } from '../borrowing.service';

describe('BorrowingService', () => {
  let borrowingService: BorrowingService;
  const borrowingRepo = mock<IBorrowingRepository>();

  beforeEach(() => {
    borrowingService = new BorrowingService(borrowingRepo);
  });

  afterEach(() => {
    mockClear(borrowingRepo);
  });

  describe('saveBorrowing', () => {
    it('should save a borrowing', async () => {
      const borrowing = new Borrowing({});
      borrowingRepo.saveBorrowing.mockResolvedValue(borrowing);

      const result = await borrowingService.saveBorrowing(borrowing);

      expect(result).toBe(borrowing);
      expect(borrowingRepo.saveBorrowing).toHaveBeenCalledWith(borrowing);
    });
  });

  describe('findBorrowing', () => {
    it('should return a list of borrowings', async () => {
      const borrowings = [new Borrowing({}), new Borrowing({})];
      borrowingRepo.findBorrowingList.mockResolvedValue(borrowings);

      const result = await borrowingService.findBorrowing(
        'memberId',
        'bookId',
        true,
      );

      expect(result).toBe(borrowings);
      expect(borrowingRepo.findBorrowingList).toHaveBeenCalledWith(
        'memberId',
        'bookId',
        true,
      );
    });
  });

  describe('countActiveBorrowings', () => {
    it('should return the count of active borrowings', async () => {
      borrowingRepo.countActiveBorrowings.mockResolvedValue(2);

      const result = await borrowingService.countActiveBorrowings('memberId');

      expect(result).toBe(2);
      expect(borrowingRepo.countActiveBorrowings).toHaveBeenCalledWith(
        'memberId',
      );
    });
  });
});
