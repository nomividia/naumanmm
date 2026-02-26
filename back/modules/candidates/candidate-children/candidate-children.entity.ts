import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../../entities/base-entity';
import { Candidate } from '../candidate.entity';
import { CandidateChildrenDto } from './candidate-children.dto';

@Entity({ name: 'candidate-children' })
export class CandidateChildren extends AppBaseEntity {
    @ManyToOne(() => Candidate, (candidate) => candidate.candidateChildrens, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    @Column('varchar', { name: 'candidateId', length: 36, nullable: true })
    candidateId: string;

    @Column('int', { name: 'childNumber', nullable: false })
    childNumber?: number;

    @Column('int', { name: 'age', nullable: false })
    age?: number;

    @Column('boolean', { name: 'isDependent', nullable: false, default: false })
    isDependent: boolean;

    toDto(): CandidateChildrenDto {
        return {
            id: this.id,
            candidateId: this.candidateId,
            childNumber: this.childNumber,
            age: this.age,
            isDependent: this.isDependent,
        };
    }

    fromDto(dto: CandidateChildrenDto) {
        this.id = dto.id;
        this.childNumber = dto.childNumber;
        this.age = dto.age;
        this.candidateId = dto.candidateId;
        this.isDependent = dto.isDependent;
    }
}
