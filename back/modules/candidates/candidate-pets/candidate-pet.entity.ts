import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../../entities/base-entity';
import { Candidate } from '../candidate.entity';
import { CandidatePetDto } from './candidate-pet-dto';

@Entity({ name: 'candidate-pet' })
export class CandidatePet extends AppBaseEntity {
    @ManyToOne(() => Candidate, (candidate) => candidate.candidatePets, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    @Column('varchar', { name: 'candidateId', length: 36, nullable: true })
    candidateId: string;

    @Column('int', { name: 'petNumber', nullable: true })
    petNumber?: number;

    @Column('varchar', { name: 'type', nullable: true })
    type: string;

    toDto(): CandidatePetDto {
        return {
            id: this.id,
            candidateId: this.candidateId,
            petNumber: this.petNumber,
            type: this.type,
        };
    }

    fromDto(dto: CandidatePetDto) {
        this.id = dto.id;
        this.petNumber = dto.petNumber;
        this.type = dto.type;
        this.candidateId = dto.candidateId;
    }
}
