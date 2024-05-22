import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { setDefaultTimestamp } from '../functions/set-default-timestamp';

export abstract class BaseJsonApiEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', default: setDefaultTimestamp })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: setDefaultTimestamp })
  updatedAt: Date;

  getAttributes(): string[] {
    const attributes: string[] = [];
    for (const key in this) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        attributes.push(key);
      }
    }
    return attributes;
  }
}
