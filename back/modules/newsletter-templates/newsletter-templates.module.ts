import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCommonModule } from '../../shared/app-common.module';
import { NewsletterTemplate } from './newsletter-template.entity';
import { NewsletterTemplatesController } from './newsletter-templates.controller';
import { NewsletterTemplatesService } from './newsletter-templates.service';

@Module({
    imports: [AppCommonModule, TypeOrmModule.forFeature([NewsletterTemplate])],
    controllers: [NewsletterTemplatesController],
    providers: [NewsletterTemplatesService],
    exports: [NewsletterTemplatesService],
})
export class NewsletterTemplatesModule {}
