import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCommonModule } from '../../shared/app-common.module';
import { JobOfferModule } from '../job-offers/job-offers.module';
import { JobReferencesModule } from '../job-references/job-references.module';
import { CustomerController } from './customer.controller';
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';

@Module({
    imports: [
        AppCommonModule,
        TypeOrmModule.forFeature([Customer]),
        JobOfferModule,
        JobReferencesModule,
    ],
    controllers: [CustomerController],

    providers: [CustomerService],
    exports: [CustomerService],
})
export class CustomerModule {}
