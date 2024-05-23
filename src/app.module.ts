import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { allConfig } from './config/all.config';
import { DatabaseModule } from './db';
import { BookModule } from './domains/book/book.module';
import { BorrowingModule } from './domains/borrowing/borrowing.module';
import { MemberModule } from './domains/member/member.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [allConfig],
      isGlobal: true,
    }),
    DatabaseModule,
    BookModule,
    MemberModule,
    BorrowingModule,
  ],
})
export class AppModule {}
