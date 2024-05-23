import { calculateDueDate } from 'src/domains/commons/functions/calculate-date';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Book } from '../../book/entities/book.entity';
import { BaseJsonApiEntity } from '../../commons/entities/abstract-base-json-api.entity';
import { Member } from '../../member/entities/member.entity';
import { CreateBorrowingDto } from '../models/create-borrowing.dto';

@Entity({ name: 'borrowing' })
export class Borrowing extends BaseJsonApiEntity {
  @Column({ name: 'borrow_date', nullable: false })
  borrowDate: Date;

  @Column({ name: 'return_date', nullable: true })
  returnDate: Date;

  @Column({ name: 'due_date', nullable: false })
  dueDate: Date;

  @Column({ name: 'is_returned', nullable: false })
  isReturned: boolean;

  @ManyToOne(() => Book, { nullable: false })
  @JoinColumn({ name: 'book_id' })
  bookId: Book;

  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn({ name: 'member_id' })
  memberId: Member;

  constructor(args: Partial<Borrowing>) {
    super();
    Object.assign(this, args);
  }

  createFromDto(input: CreateBorrowingDto): void {
    const now = new Date();
    const dueDate = calculateDueDate(now, 7);

    this.memberId = new Member({
      id: input.memberId?.trim(),
    });
    this.bookId = new Book({
      id: input.bookId?.trim(),
    });
    this.borrowDate = now;
    this.isReturned = false;
    this.dueDate = dueDate;
  }

  isGotPenalized(): boolean {
    const now = new Date();
    return now > this.dueDate;
  }

  createReturn(): void {
    this.returnDate = new Date();
    this.isReturned = true;
  }
}
