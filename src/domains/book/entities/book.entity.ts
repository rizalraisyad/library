import { Column, Entity, OneToMany } from 'typeorm';
import { Borrowing } from '../../borrowing/entity/borrowing.entity';
import { BaseJsonApiEntity } from '../../commons/entities/abstract-base-json-api.entity';

@Entity({ name: 'book' })
export class Book extends BaseJsonApiEntity {
  @Column({ name: 'code', nullable: false, unique: true })
  code: string;

  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'author', nullable: false })
  author: string;

  @Column({ name: 'stock', nullable: false })
  stock: string;

  @Column({ name: 'available_quantity', nullable: false })
  availableQuantity: string;

  @Column({ name: 'borrowed_quantity', nullable: false })
  borrowedQuantity: string;

  @OneToMany(() => Borrowing, (br) => br.bookId)
  borrowedList: Borrowing[];

  constructor(args: Partial<Book>) {
    super();
    Object.assign(this, args);
  }
}
