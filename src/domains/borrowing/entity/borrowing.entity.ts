import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Book } from '../../book/entities/book.entity';
import { BaseJsonApiEntity } from '../../commons/entities/abstract-base-json-api.entity';
import { Member } from '../../member/entities/member.entity';

@Entity({ name: 'borrowing' })
export class Borrowing extends BaseJsonApiEntity {
  @Column({ name: 'borrow_date', nullable: false })
  borrowDate: string;

  @Column({ name: 'return_date', nullable: true })
  returnDate: string;

  @Column({ name: 'due_date', nullable: false })
  dueDate: string;

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
}
