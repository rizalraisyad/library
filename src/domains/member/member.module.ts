import { Module, Provider } from '@nestjs/common';
import { MemberController } from './controllers/member.controller';
import { Member } from './entities/member.entity';
import { MEMBER_REPO, MEMBER_SERVICE, MEMBER_USECASE } from './member.constant';
import { MemberRepository } from './repositories/member.repository';
import { MemberService } from './services/member.service';
import { MemberUseCase } from './use-cases/member.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';

const providers: Provider[] = [
  {
    provide: MEMBER_REPO,
    useClass: MemberRepository,
  },
  {
    provide: MEMBER_SERVICE,
    useClass: MemberService,
  },
  {
    provide: MEMBER_USECASE,
    useClass: MemberUseCase,
  },
];

const controllers: any[] = [MemberController];
const repositories: any[] = [Member];

@Module({
  imports: [TypeOrmModule.forFeature([...repositories])],
  controllers: [...controllers],
  providers: [...providers],
  exports: [...providers],
})
export class MemberModule {}
