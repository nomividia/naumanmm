import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCommonModule } from '../../shared/app-common.module';
import { JobReference } from './job-reference.entity';
import { JobReferencesController } from './job-references.controller';
import { JobReferencesService } from './job-references.service';

@Module({
    imports: [
        forwardRef(() => AppCommonModule),
        TypeOrmModule.forFeature([JobReference]),
    ],
    controllers: [JobReferencesController],
    providers: [JobReferencesService],
    exports: [JobReferencesService],
})
export class JobReferencesModule {}
