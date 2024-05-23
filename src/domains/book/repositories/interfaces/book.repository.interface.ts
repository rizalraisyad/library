import { BaseRepository } from 'src/domains/commons/repositories';
import { Book } from '../../entities/book.entity';

export interface IBookRepository extends BaseRepository<Book> {
  findBookByCode(code: string): Promise<Book>;
  findBookById(bookId: string): Promise<Book>;
  findBooks(): Promise<Book[]>;
  saveBook(book: Book): Promise<Book>;
}
