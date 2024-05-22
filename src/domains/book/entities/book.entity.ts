import { Column, Entity, OneToMany } from 'typeorm';
import { Borrowing } from '../../borrowing/entity/borrowing.entity';
import { BaseJsonApiEntity } from '../../commons/entities/abstract-base-json-api.entity';
import { CreateBookDto } from '../models/create-book.dto';

@Entity({ name: 'book' })
export class Book extends BaseJsonApiEntity {
  @Column({ name: 'code', nullable: false, unique: true })
  code: string;

  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'author', nullable: false })
  author: string;

  @Column({ name: 'stock', nullable: false })
  stock: number;

  @Column({ name: 'available_quantity', nullable: false })
  availableQuantity: number;

  @Column({ name: 'borrowed_quantity', nullable: false })
  borrowedQuantity: number;

  @OneToMany(() => Borrowing, (br) => br.bookId)
  borrowedList: Borrowing[];

  constructor(args: Partial<Book>) {
    super();
    Object.assign(this, args);
  }

  createFromDto(input: CreateBookDto): void {
    this.author = input.author?.trim();
    this.title = input.title?.trim();
    this.stock = input.stock;
    this.code = input.code?.trim();
    this.availableQuantity = input.stock;
    this.borrowedQuantity = 0;
  }
}
