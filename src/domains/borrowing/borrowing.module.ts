import { forwardRef, Module, Provider } from '@nestjs/common';

import {
  BORROWING_REPO,
  BORROWING_SERVICE,
  BORROWING_USECASE,
} from './borrowing.constant';

import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowingController } from './controllers/borrowing.controller';
import { Borrowing } from './entity/borrowing.entity';
import { BorrowingUseCase } from './use-cases/borrowing.use-case';
import { MemberModule } from '../member/member.module';
import { BookModule } from '../book/book.module';
import { BorrowingRepository } from './repositories/borrowing.repository';
import { BorrowingService } from './services/borrowing.service';

const providers: Provider[] = [
  {
    provide: BORROWING_REPO,
    useClass: BorrowingRepository,
  },
  {
    provide: BORROWING_SERVICE,
    useClass: BorrowingService,
  },
  {
    provide: BORROWING_USECASE,
    useClass: BorrowingUseCase,
  },
];

const controllers: any[] = [BorrowingController];
const repositories: any[] = [Borrowing];

@Module({
  imports: [
    forwardRef(() => MemberModule),
    forwardRef(() => BookModule),
    TypeOrmModule.forFeature([...repositories]),
  ],
  controllers: [...controllers],
  providers: [...providers],
  exports: [...providers],
})
export class BorrowingModule {}
