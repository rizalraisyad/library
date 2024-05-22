import {
  DeleteResult,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  ObjectId,
  ObjectType,
  SaveOptions,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseRepository } from './interfaces/base-repository';

export abstract class AbstractBaseRepository<T> implements BaseRepository<T> {
  constructor(
    protected readonly manager: EntityManager,
    protected readonly Entity: ObjectType<T>,
  ) {}

  createQueryBuilder(entityName: string): SelectQueryBuilder<T> {
    return this.manager.createQueryBuilder(this.Entity, entityName);
  }

  save(entities: T[], options?: SaveOptions): Promise<T[]> {
    return this.manager.save<T>(entities, options);
  }
  async saveOne(entity: T, options?: SaveOptions): Promise<T> {
    const res = await this.manager.save<T>([entity], options);
    return res.pop();
  }
  insert(
    entity: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
  ): Promise<InsertResult> {
    return this.manager.insert<T>(this.Entity, entity);
  }
  count(options?: FindManyOptions<T>): Promise<number> {
    return this.manager.count(this.Entity, options);
  }
  find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.manager.find(this.Entity, options);
  }
  findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
    return this.manager.findAndCount<T>(this.Entity, options);
  }
  findOne(options?: FindOneOptions<T>): Promise<T> {
    return this.manager.findOne<T>(this.Entity, options);
  }
  findOneOrFail(options?: FindOneOptions<T>): Promise<T> {
    return this.manager.findOneOrFail<T>(this.Entity, options);
  }
  delete(
    criteria:
      | string
      | number
      | string[]
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<T>,
  ): Promise<DeleteResult> {
    return this.manager.delete<T>(this.Entity, criteria);
  }
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
  ): Promise<UpdateResult> {
    return this.manager.update<T>(this.Entity, criteria, partialEntity);
  }
}
