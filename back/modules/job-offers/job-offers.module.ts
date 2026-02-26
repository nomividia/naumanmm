import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCommonModule } from '../../shared/app-common.module';
import { MailModule } from '../mail/mail.module';
import { JobOffer } from './job-offer.entity';
import { JobOfferController } from './job-offers.controller';
import { JobOfferService } from './job-offers.service';

@Module({
    imports: [
        forwardRef(() => AppCommonModule),
        TypeOrmModule.forFeature([JobOffer]),
        MailModule,
    ],
    controllers: [JobOfferController],
    providers: [JobOfferService],
    exports: [JobOfferService],
})
export class JobOfferModule {}
