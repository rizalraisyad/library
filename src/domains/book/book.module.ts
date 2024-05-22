import { Module, Provider } from '@nestjs/common';
import { BookController } from './controllers/book.controller';

// const providers: Provider[] = [

// ];
const controllers: any[] = [BookController];
// const repositories: any[] = [User, UserResidence, MotoristReview];

@Module({
  imports: [
    // TypeOrmModule.forFeature([Role, ...repositories]),
  ],
  controllers: [...controllers],
  providers: [],
  exports: [],
})
export class BookModule {}
