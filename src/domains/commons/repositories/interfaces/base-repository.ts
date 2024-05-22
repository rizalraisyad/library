import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  ObjectId,
  SaveOptions,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface BaseRepository<T> {
  createQueryBuilder(entityName: string): SelectQueryBuilder<T>;
  save(entities: T[], options?: SaveOptions): Promise<T[]>;
  saveOne(entity: T, options?: SaveOptions): Promise<T>;
  insert(
    entity: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
  ): Promise<InsertResult>;

  count(options?: FindManyOptions<T>): Promise<number>;

  find(options?: FindManyOptions<T>): Promise<T[]>;
  findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;
  findOne(options?: FindOneOptions<T>): Promise<T | undefined>;
  findOneOrFail(options?: FindOneOptions<T>): Promise<T>;

  delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<T>,
  ): Promise<DeleteResult>;

  update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | any,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult>;
}
