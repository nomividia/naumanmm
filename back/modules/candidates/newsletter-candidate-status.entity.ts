import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppValue } from '../../entities/app-value.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { Newsletter } from '../newsletter/newsletter.entity';
import { NewsLetterCandidateStatusDto } from './newsletter-candidate-status.dto';

@Entity({ name: 'newsletter-candidate-status' })
export class NewsLetterCandidateStatus extends AppBaseEntity {
    @Column('varchar', {
        name: 'candidateStatusId',
        length: 36,
        nullable: false,
    })
    candidateStatusId?: string;

    @ManyToOne(() => AppValue, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    @JoinColumn({ name: 'candidateStatusId' })
    candidateStatus: AppValue;

    @Column('varchar', { name: 'newsletterId', length: 36, nullable: false })
    newsletterId?: string;

    @ManyToOne(
        () => Newsletter,
        (newsLetter) => newsLetter.newsLettersCandidateStatus,
        { onDelete: 'CASCADE', orphanedRowAction: 'delete' },
    )
    @JoinColumn({ name: 'newsletterId' })
    newsLetter: Newsletter;

    toDto(): NewsLetterCandidateStatusDto {
        return {
            id: this.id,
            candidateStatusId: this.candidateStatusId,
            newsletterId: this.newsletterId,
            candidateStatus: this.candidateStatus
                ? this.candidateStatus.toDto()
                : null,
            newsLetter: this.newsLetter ? this.newsLetter.toDto() : null,
        };
    }

    fromDto(dto: NewsLetterCandidateStatusDto) {
        this.id = dto.id;
        this.candidateStatusId = dto.candidateStatusId;
        this.newsletterId = this.newsletterId;

        if (!this.id) {
            this.id = undefined;
        }
    }
}
