import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CandidateReadonlyField } from '../../../../shared/shared-constants';
import { Candidate } from '../candidate.entity';
import { CandidateReadonlyPropertyDto } from './candidate-readonly-property.dto';

@Entity({ name: 'candidate-readonly-property' })
export class CandidateReadonlyProperty {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column('varchar', { name: 'candidateReadonlyField', length: 80 })
    candidateReadonlyField: CandidateReadonlyField;

    @ManyToOne(
        () => Candidate,
        (candidate) => candidate.candidateReadonlyProperties,
        { onDelete: 'CASCADE', orphanedRowAction: 'delete' },
    )
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    @Column('varchar', { name: 'candidateId', length: 36, nullable: true })
    candidateId?: string;

    toDto(): CandidateReadonlyPropertyDto {
        return {
            id: this.id,
            candidateId: this.candidateId,
            candidateReadonlyField: this.candidateReadonlyField,
        };
    }

    fromDto(dto: CandidateReadonlyPropertyDto) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.candidateReadonlyField = dto.candidateReadonlyField;
    }
}
