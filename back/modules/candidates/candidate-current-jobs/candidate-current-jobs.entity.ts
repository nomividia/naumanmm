import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppValue } from '../../../entities/app-value.entity';
import { AppBaseEntity } from '../../../entities/base-entity';
import { Candidate } from '../candidate.entity';
import { CandidateCurrentJobDto } from './candidate-current-jobs.dto';

@Entity({ name: 'candidate-current-jobs' })
export class CandidateCurrentJob extends AppBaseEntity {
    @Column('varchar', { name: 'candidateId', length: 36, nullable: true })
    candidateId?: string;

    @ManyToOne(() => Candidate, (candidate) => candidate.candidateCurrentJobs, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    @Column('varchar', { name: 'currentJobId', length: 36, nullable: false })
    currentJobId?: string;

    @ManyToOne(() => AppValue, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'currentJobId' })
    currentJob?: AppValue;

    toDto(): CandidateCurrentJobDto {
        return {
            id: this.id,
            candidateId: this.candidateId,
            candidate: this.candidate ? this.candidate.toDto() : null,
            currentJobId: this.currentJobId,
            currentJob: this.currentJob ? this.currentJob.toDto() : null,
        };
    }

    fromDto(dto: CandidateCurrentJobDto) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.currentJobId = dto.currentJobId;

        if (!this.id) {
            this.id = undefined;
        }
    }
}
