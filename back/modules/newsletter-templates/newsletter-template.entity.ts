import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../../entities/base-entity';
import { NewsletterTemplateDto } from './newsletter-template.dto';

@Entity({ name: 'newsletter-templates' })
export class NewsletterTemplate extends AppBaseEntity {
    @Column('mediumtext', { name: 'content', nullable: false })
    content: string;

    @Column('varchar', { name: 'title', nullable: false, length: 255 })
    title: string;

    @Column('varchar', { name: 'subject', nullable: true, length: 100 })
    subject?: string;

    toDto(): NewsletterTemplateDto {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            disabled: this.disabled,

            content: this.content,
            title: this.title,
            subject: this.subject,
        };
    }

    fromDto(dto: NewsletterTemplateDto) {
        this.id = dto.id;
        this.creationDate = dto.creationDate;
        this.modifDate = dto.modifDate;
        this.disabled = dto.disabled;

        this.content = dto.content;
        this.title = dto.title;
        this.subject = dto.subject;

        if (!dto.id) {
            this.id = undefined;
        }
    }
}
