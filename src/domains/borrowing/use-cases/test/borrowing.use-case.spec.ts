import { BadRequestException } from '@nestjs/common';
import { mock, mockClear } from 'jest-mock-extended';
import { MemberUseCase } from 'src/domains/member/use-cases/member.use-case';
import { BookService } from 'src/domains/book/services/book.service';
import { BorrowingUseCase } from 'src/domains/borrowing/use-cases/borrowing.use-case';
import { BorrowingService } from 'src/domains/borrowing/services/borrowing.service';
import { CreateBorrowingDto } from 'src/domains/borrowing/models/create-borrowing.dto';
import { Borrowing } from 'src/domains/borrowing/entity/borrowing.entity';
import { Book } from 'src/domains/book/entities/book.entity';

describe('BorrowingUseCase', () => {
  let borrowingUseCase: BorrowingUseCase;
  const memberUseCase = mock<MemberUseCase>();
  const bookService = mock<BookService>();
  const borrowingService = mock<BorrowingService>();

  beforeEach(() => {
    borrowingUseCase = new BorrowingUseCase(
      memberUseCase,
      bookService,
      borrowingService,
    );
  });

  afterEach(() => {
    mockClear(memberUseCase);
    mockClear(bookService);
    mockClear(borrowingService);
  });

  describe('validateMemberUnderPenaltyOrThrow', () => {
    it('should throw BadRequestException if member is penalized', async () => {
      memberUseCase.isMemberBeingPenalized.mockResolvedValue(true);

      await expect(
        borrowingUseCase['validateMemberUnderPenaltyOrThrow']('memberId'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return null if member is not penalized', async () => {
      memberUseCase.isMemberBeingPenalized.mockResolvedValue(false);

      await expect(
        borrowingUseCase['validateMemberUnderPenaltyOrThrow']('memberId'),
      ).resolves.toBeNull();
    });
  });

  describe('validateMemberSlotForBorrowOrThrow', () => {
    it('should throw BadRequestException if member has already borrowed 2 books', async () => {
      borrowingService.countActiveBorrowings.mockResolvedValue(2);

      await expect(
        borrowingUseCase['validateMemberSlotForBorrowOrThrow']('memberId'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return null if member has borrowed less than 2 books', async () => {
      borrowingService.countActiveBorrowings.mockResolvedValue(1);

      await expect(
        borrowingUseCase['validateMemberSlotForBorrowOrThrow']('memberId'),
      ).resolves.toBeNull();
    });
  });

  describe('validateBookStockOrThrow', () => {
    it('should throw BadRequestException if book is out of stock', async () => {
      bookService.findBookById.mockResolvedValue(
        new Book({
          availableQuantity: 0,
        }),
      );

      await expect(
        borrowingUseCase['validateBookStockOrThrow']('bookId'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return null if book is in stock', async () => {
      bookService.findBookById.mockResolvedValue(
        new Book({
          availableQuantity: 1,
        }),
      );

      await expect(
        borrowingUseCase['validateBookStockOrThrow']('bookId'),
      ).resolves.toBeNull();
    });
  });

  describe('createBorrowingTransaction', () => {
    it('should create a borrowing transaction successfully', async () => {
      const input: CreateBorrowingDto = {
        memberId: 'memberId',
        bookId: 'bookId',
      };

      borrowingUseCase['validateBookStockOrThrow'] = jest
        .fn()
        .mockResolvedValue(null);
      borrowingUseCase['validateMemberSlotForBorrowOrThrow'] = jest
        .fn()
        .mockResolvedValue(null);
      borrowingUseCase['validateMemberUnderPenaltyOrThrow'] = jest
        .fn()
        .mockResolvedValue(null);
      bookService.decrementStockAvailabilityAndIncrementBorrowedQty.mockResolvedValue(
        null,
      );
      borrowingService.saveBorrowing.mockResolvedValue(new Borrowing({}));

      const result = await borrowingUseCase.createBorrowingTransaction(input);

      expect(result).toBeInstanceOf(Borrowing);
    });

    it('should throw BadRequestException if validation fails', async () => {
      const input: CreateBorrowingDto = {
        memberId: 'memberId',
        bookId: 'bookId',
      };

      borrowingUseCase['validateBookStockOrThrow'] = jest
        .fn()
        .mockRejectedValue(new BadRequestException());

      await expect(
        borrowingUseCase.createBorrowingTransaction(input),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('returnBorrowingTransaction', () => {
    it('should return a borrowing transaction successfully', async () => {
      const input: CreateBorrowingDto = {
        memberId: 'memberId',
        bookId: 'bookId',
      };

      const borrowing = new Borrowing({});
      borrowingUseCase['validateBookAndMemberOrThrow'] = jest
        .fn()
        .mockResolvedValue(borrowing);
      borrowingUseCase['validateBorrowingAndApplyPenalty'] = jest
        .fn()
        .mockResolvedValue(borrowing);
      bookService.incrementStockAvailabilityAndDecrementBorrowedQty.mockResolvedValue(
        null,
      );
      borrowingService.saveBorrowing.mockResolvedValue(borrowing);

      const result = await borrowingUseCase.returnBorrowingTransaction(input);

      expect(result).toBeInstanceOf(Borrowing);
    });

    it('should throw BadRequestException if validation fails', async () => {
      const input: CreateBorrowingDto = {
        memberId: 'memberId',
        bookId: 'bookId',
      };

      borrowingUseCase['validateBookAndMemberOrThrow'] = jest
        .fn()
        .mockRejectedValue(new BadRequestException());

      await expect(
        borrowingUseCase.returnBorrowingTransaction(input),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
