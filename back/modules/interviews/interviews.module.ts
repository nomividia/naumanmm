import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthToolsService } from '../../services/auth-tools.service';
import { AppCommonModule } from '../../shared/app-common.module';
import { CandidateModule } from '../candidates/candidates.module';
import { MailModule } from '../mail/mail.module';
import { Interview } from './interview.entity';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';

@Module({
    imports: [
        AppCommonModule,
        TypeOrmModule.forFeature([Interview]),
        MailModule,
        CandidateModule,
    ],
    controllers: [InterviewsController],
    providers: [InterviewsService, AuthToolsService],
    exports: [InterviewsService],
})
export class InterviewsModule {}
