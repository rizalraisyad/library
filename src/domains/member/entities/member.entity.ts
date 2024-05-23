import { calculateDueDate } from 'src/domains/commons/functions/calculate-date';
import { Column, Entity, OneToMany } from 'typeorm';
import { Borrowing } from '../../borrowing/entity/borrowing.entity';
import { BaseJsonApiEntity } from '../../commons/entities/abstract-base-json-api.entity';
import { CreateMemberDto } from '../models/create-member.dto';

@Entity({ name: 'member' })
export class Member extends BaseJsonApiEntity {
  @Column({ name: 'code', nullable: false, unique: true })
  code: string;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'penalty_status', nullable: false })
  penaltyStatus: boolean;

  @Column({ name: 'penalty_end_date', nullable: true })
  penaltyEndDate: Date;

  @OneToMany(() => Borrowing, (br) => br.memberId)
  borrowingList: Borrowing[];

  constructor(args: Partial<Member>) {
    super();
    Object.assign(this, args);
  }

  createFromDto(input: CreateMemberDto): void {
    this.code = input.code?.trim();
    this.name = input.name?.trim();
    this.penaltyStatus = false;
  }

  isMemberUnderPenalty(): boolean {
    const now = new Date();
    return now > this.penaltyEndDate;
  }

  applyPenalty(): void {
    const now = new Date();
    this.penaltyStatus = true;
    this.penaltyEndDate = calculateDueDate(now, 3);
  }
}
