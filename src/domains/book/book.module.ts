import { Module, Provider } from '@nestjs/common';
import { BOOK_REPO, BOOK_SERVICE, BOOK_USECASE } from './book.constant';
import { BookController } from './controllers/book.controller';
import { Book } from './entities/book.entity';

import { BookService } from './services/book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookUseCase } from './use-cases/book.use-case';
import { BookRepository } from './repositories/book.repository';

const providers: Provider[] = [
  {
    provide: BOOK_REPO,
    useClass: BookRepository,
  },
  {
    provide: BOOK_SERVICE,
    useClass: BookService,
  },
  {
    provide: BOOK_USECASE,
    useClass: BookUseCase,
  },
];

// ];
const controllers: any[] = [BookController];
const repositories: any[] = [Book];

@Module({
  imports: [TypeOrmModule.forFeature([...repositories])],
  controllers: [...controllers],
  providers: [...providers],
  exports: [...providers],
})
export class BookModule {}
