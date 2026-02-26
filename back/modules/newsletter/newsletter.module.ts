import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCommonModule } from '../../shared/app-common.module';
import { CandidatApplicationModule } from '../candidates-application/candidate-applications.module';
import { CandidateModule } from '../candidates/candidates.module';
import { MailModule } from '../mail/mail.module';
import { SmsModule } from '../sms/sms.module';
import { NewsletterController } from './newsletter.controller';
import { Newsletter } from './newsletter.entity';
import { NewsletterService } from './newsletter.service';

@Module({
    imports: [
        AppCommonModule,
        TypeOrmModule.forFeature([Newsletter]),
        CandidateModule,
        MailModule,
        SmsModule,
        CandidatApplicationModule,
    ],
    controllers: [NewsletterController],
    providers: [NewsletterService],
    exports: [NewsletterService],
})
export class NewsletterModule {}
