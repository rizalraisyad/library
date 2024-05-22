import { Column, Entity, OneToMany } from 'typeorm';
import { Borrowing } from '../../borrowing/entity/borrowing.entity';
import { BaseJsonApiEntity } from '../../commons/entities/abstract-base-json-api.entity';

@Entity({ name: 'member' })
export class Member extends BaseJsonApiEntity {
  @Column({ name: 'code', nullable: false, unique: true })
  code: string;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'penalty_status', nullable: false })
  penaltyStatus: string;

  @Column({ name: 'penalty_end_date', nullable: true })
  penaltyEndDate: string;

  @OneToMany(() => Borrowing, (br) => br.memberId)
  borrowingList: Borrowing[];

  constructor(args: Partial<Member>) {
    super();
    Object.assign(this, args);
  }
}
