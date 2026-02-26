import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../entities/base-entity';
import { JobOffer } from '../job-offers/job-offer.entity';
import { Newsletter } from '../newsletter/newsletter.entity';
import { NewsletterJobOfferDto } from './newsletter-joboffer.dto';

@Entity({ name: 'newsletter-joboffer' })
export class NewsletterJobOffer extends AppBaseEntity {
    @Column('varchar', { name: 'jobOfferId', length: 36, nullable: false })
    jobOfferId?: string;

    @Column('varchar', { name: 'newsletterId', length: 36, nullable: false })
    newsletterId?: string;

    @ManyToOne(() => JobOffer, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    @JoinColumn({ name: 'jobOfferId' })
    jobOffer?: JobOffer;

    @ManyToOne(
        () => Newsletter,
        (newsletter) => newsletter.newslettersJobOffer,
        { onDelete: 'CASCADE', orphanedRowAction: 'delete' },
    )
    @JoinColumn({ name: 'newsletterId' })
    newsletter?: Newsletter;

    toDto(): NewsletterJobOfferDto {
        return {
            id: this.id,
            jobofferId: this.jobOfferId,
            newsletterId: this.newsletterId,
            joboffer: this.jobOffer ? this.jobOffer.toDto() : null,
            newsletter: this.newsletter ? this.newsletter.toDto() : null,
        };
    }

    fromDto(dto: NewsletterJobOfferDto) {
        this.id = dto.id;
        this.newsletterId = dto.newsletterId;
        this.jobOfferId = dto.jobofferId;

        if (!dto.id) {
            this.id = undefined;
        }
    }
}
