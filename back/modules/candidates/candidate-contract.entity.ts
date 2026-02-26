import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppValue } from '../../entities/app-value.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { CandidateContractDto } from './candidate-contract.dto';
import { Candidate } from './candidate.entity';

@Entity({ name: 'candidate-contracts' })
export class CandidateContract extends AppBaseEntity {
    @Column('varchar', { name: 'candidateId', nullable: true, length: 36 })
    candidateId?: string;

    @ManyToOne(() => Candidate, (candidate) => candidate.candidateJobs, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    @Column('varchar', { name: 'contractTypeId', nullable: true, length: 36 })
    contractTypeId?: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'contractTypeId' })
    contractType?: AppValue;

    toDto(): CandidateContractDto {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            candidateId: this.candidateId,
            contractTypeId: this.contractTypeId,
            contractType: this.contractType ? this.contractType.toDto() : null,
        };
    }

    fromDto(dto: CandidateContractDto) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.contractTypeId = dto.contractTypeId;

        if (!this.id) {
            this.id = undefined;
        }
    }
}
