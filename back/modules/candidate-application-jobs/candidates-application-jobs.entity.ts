import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../entities/base-entity';
import { CandidateApplication } from '../candidates-application/candidate-application.entity';
import { JobOffer } from '../job-offers/job-offer.entity';
import { CandidateApplicationJobsDto } from './candidates-application-jobs-dto';

@Entity({ name: 'candidate-application-jobs' })
export class CandidateApplicationJobs extends AppBaseEntity {
    @Column('varchar', { name: 'candidateApplicationId', length: 36 })
    candidateApplicationId: string;

    @ManyToOne(
        () => CandidateApplication,
        (candidateApplication) => candidateApplication.candidateApplicationJobs,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'candidateApplicationId' })
    candidateApplication?: CandidateApplication;

    @Column('varchar', { name: 'jobOfferId', length: 36 })
    jobOfferId: string;
    @ManyToOne(
        () => JobOffer,
        (jobOffer) => jobOffer.candidateApplicationJobs,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'jobOfferId' })
    jobOffer?: JobOffer;

    public toDto(): CandidateApplicationJobsDto {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            candidateApplicationId: this.candidateApplicationId,
            jobOfferId: this.jobOfferId,
            candidateApplication: this.candidateApplication
                ? this.candidateApplication.toDto()
                : undefined,
            jobOffer: this.jobOffer ? this.jobOffer.toDto() : undefined,
        };
    }

    public fromDto(dto: CandidateApplicationJobsDto) {
        this.id = dto.id;
        this.creationDate = dto.creationDate;
        this.jobOfferId = dto.jobOfferId;
        this.candidateApplicationId = dto.candidateApplicationId;

        if (!this.id) {
            this.id = undefined;
        }
    }
}
