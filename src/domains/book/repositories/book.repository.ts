import { Injectable } from '@nestjs/common';
import { AbstractBaseRepository } from 'src/domains/commons/repositories';
import { Book } from '../entities/book.entity';
import { IBookRepository } from './interfaces/book.repository.interface';
import { EntityManager } from 'typeorm';

@Injectable()
export class BookRepository
  extends AbstractBaseRepository<Book>
  implements IBookRepository
{
  constructor(manager: EntityManager) {
    super(manager, Book);
  }
  async findBooks(): Promise<Book[]> {
    const qb = this.manager.createQueryBuilder(this.Entity, 'b');
    return await qb.getMany();
  }

  async findBookById(bookId: string): Promise<Book> {
    const qb = this.manager.createQueryBuilder(this.Entity, 'b');
    qb.where('b.id::text like :bookId', { bookId: bookId });
    return await qb.getOne();
  }
  async findBookByCode(code: string): Promise<Book> {
    const qb = this.manager.createQueryBuilder(this.Entity, 'b');
    qb.where('b.code like :code', { code: code });

    return await qb.getOne();
  }

  async saveBook(book: Book): Promise<Book> {
    const res = await this.saveOne(book);
    return res;
  }
}
