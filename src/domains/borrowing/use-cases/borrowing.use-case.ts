import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { BOOK_SERVICE } from 'src/domains/book/book.constant';
import { BookService } from 'src/domains/book/services/book.service';
import { MEMBER_USECASE } from 'src/domains/member/member.constant';
import { MemberUseCase } from 'src/domains/member/use-cases/member.use-case';
import { ErrorObject, ErrorResponse } from 'src/exceptions/models/error-object';
import { BORROWING_SERVICE } from '../borrowing.constant';
import { Borrowing } from '../entity/borrowing.entity';
import { CreateBorrowingDto } from '../models/create-borrowing.dto';
import { BorrowingService } from '../services/borrowing.service';

@Injectable()
export class BorrowingUseCase {
  constructor(
    @Inject(forwardRef(() => MEMBER_USECASE))
    private readonly memberUseCase: MemberUseCase,
    @Inject(forwardRef(() => BOOK_SERVICE))
    private readonly bookService: BookService,
    @Inject(BORROWING_SERVICE)
    private readonly borrowingService: BorrowingService,
  ) {}
  private async validateMemberUnderPenaltyOrThrow(
    id: string,
  ): Promise<ErrorResponse> {
    const errorResp = new ErrorResponse();
    errorResp.errors = [];
    const isPenalizedMember =
      await this.memberUseCase.isMemberBeingPenalized(id);
    if (isPenalizedMember) {
      const newErr = new ErrorObject();
      (newErr.title = 'Borrowing Transaction Failed'),
        (newErr.detail = `Member with id: ${id} is being penalized`);
      errorResp.errors.push(newErr);

      throw new BadRequestException(errorResp);
    }

    return null;
  }

  private async validateMemberSlotForBorrowOrThrow(
    id: string,
  ): Promise<ErrorResponse> {
    const errorResp = new ErrorResponse();
    errorResp.errors = [];
    const countActiveBorrowings =
      await this.borrowingService.countActiveBorrowings(id);
    if (countActiveBorrowings >= 2) {
      const newErr = new ErrorObject();
      newErr.title = 'Borrowing Transaction Failed';
      newErr.detail = `Member with id: ${id} has already borrowed 2 books and cannot borrow more.`;
      errorResp.errors.push(newErr);

      throw new BadRequestException(errorResp);
    }

    return null;
  }

  private async validateBookStockOrThrow(
    bookId: string,
  ): Promise<ErrorResponse> {
    const errorResp = new ErrorResponse();
    errorResp.errors = [];
    const book = await this.bookService.findBookById(bookId);
    if (book === null) {
      const errorResp = new ErrorResponse();
      errorResp.errors = [];
      const newErr = new ErrorObject();
      (newErr.title = 'Validate Book Failed'),
        (newErr.detail = `Book with code: ${bookId} not found`);
      errorResp.errors.push(newErr);
      throw new BadRequestException(errorResp);
    }

    if (book.availableQuantity <= 0) {
      const newErr = new ErrorObject();
      newErr.title = 'Borrowing Transaction Failed';
      newErr.detail = `Book with id: ${bookId} is out of stock.`;
      errorResp.errors.push(newErr);

      throw new BadRequestException(errorResp);
    }

    return null;
  }

  async createBorrowingTransaction(
    input: CreateBorrowingDto,
  ): Promise<Borrowing> {
    await this.validateBookStockOrThrow(input.bookId);
    await this.validateMemberSlotForBorrowOrThrow(input.memberId);
    await this.validateMemberUnderPenaltyOrThrow(input.memberId);

    const borrowing = new Borrowing({});
    borrowing.createFromDto(input);

    await this.bookService.decrementStockAvailabilityAndIncrementBorrowedQty(
      input.bookId,
    );

    const res = this.borrowingService.saveBorrowing(borrowing);
    return res;
  }

  private async validateBookAndMemberOrThrow(
    input: CreateBorrowingDto,
  ): Promise<Borrowing> {
    const errorResp = new ErrorResponse();
    errorResp.errors = [];
    const borrowing = await this.borrowingService.findBorrowing(
      input.memberId,
      input.bookId,
      false,
    );

    if (borrowing.length === 0) {
      const newErr = new ErrorObject();
      newErr.title = 'Return Failed';
      newErr.detail = `Member with id: ${input.memberId} has no borrowed book with id ${input.bookId} to return.`;
      errorResp.errors.push(newErr);

      throw new BadRequestException(errorResp);
    }

    return borrowing[0];
  }

  private async validateBorrowingAndApplyPenalty(
    borrowing: Borrowing,
  ): Promise<Borrowing> {
    if (borrowing.isGotPenalized()) {
      const updatedMember = await this.memberUseCase.applyPenalty(
        borrowing.memberId.id,
      );
      borrowing.memberId = updatedMember;
    }
    return borrowing;
  }

  async returnBorrowingTransaction(
    input: CreateBorrowingDto,
  ): Promise<Borrowing> {
    const borrowing = await this.validateBookAndMemberOrThrow(input);
    await this.validateBorrowingAndApplyPenalty(borrowing);

    await this.bookService.incrementStockAvailabilityAndDecrementBorrowedQty(
      input.bookId,
    );
    borrowing.createReturn();
    const res = this.borrowingService.saveBorrowing(borrowing);
    return res;
  }
}
