import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppValue } from '../../entities/app-value.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { Newsletter } from '../newsletter/newsletter.entity';
import { NewsLetterCandidateJobsDto } from './newsletter-candidate-jobs.dto';

@Entity({ name: 'newsletter-candidate-jobs' })
export class NewsLetterCandidateJobs extends AppBaseEntity {
    @Column('varchar', { name: 'jobTypeId', length: 36, nullable: false })
    jobTypeId?: string;

    @ManyToOne(() => AppValue, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    @JoinColumn({ name: 'jobTypeId' })
    jobType?: AppValue;

    @Column('varchar', { name: 'newsLetterId', length: 36, nullable: false })
    newsLetterId?: string;

    @ManyToOne(
        () => Newsletter,
        (newsLetter) => newsLetter.newsLettersCandidateJobs,
        { onDelete: 'CASCADE', orphanedRowAction: 'delete' },
    )
    @JoinColumn({ name: 'newsLetterId' })
    newsLetter?: Newsletter;

    toDto(): NewsLetterCandidateJobsDto {
        return {
            id: this.id,
            jobTypeId: this.jobTypeId,
            newsLetterId: this.newsLetterId,
            jobType: this.jobType ? this.jobType.toDto() : null,
            newsLetter: this.newsLetter ? this.newsLetter.toDto() : null,
        };
    }

    fromDto(dto: NewsLetterCandidateJobsDto) {
        this.id = dto.id;
        this.jobTypeId = dto.jobTypeId;
        this.newsLetterId = dto.newsLetterId;

        if (!this.id) {
            this.id = undefined;
        }
    }
}
