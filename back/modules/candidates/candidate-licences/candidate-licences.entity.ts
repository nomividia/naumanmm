import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppValue } from '../../../entities/app-value.entity';
import { AppBaseEntity } from '../../../entities/base-entity';
import { Candidate } from '../candidate.entity';
import { CandidateLicenceDto } from './candidate-licences-dto';

@Entity({ name: 'candidate-licences' })
export class CandidateLicence extends AppBaseEntity {
    @ManyToOne(() => Candidate, (candidate) => candidate.candidateLanguages, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    @Column('varchar', { name: 'candidateId', nullable: true, length: 36 })
    candidateId?: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'licenceId' })
    licence?: AppValue;

    @Column('varchar', { name: 'licenceId', length: 36, nullable: true })
    licenceId?: string;

    @Column('varchar', { name: 'countryCode', nullable: true, length: 36 })
    countryCode?: string;

    toDto(): CandidateLicenceDto {
        return {
            id: this.id,
            candidateId: this.candidateId,
            candidate: this.candidate ? this.candidate.toDto() : null,
            licence: this.licence ? this.licence.toDto() : null,
            licenceId: this.licenceId,
            countryCode: this.countryCode,
        };
    }

    fromDto(dto: CandidateLicenceDto) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.licenceId = dto.licenceId;
        this.countryCode = dto.countryCode;

        if (!this.id) {
            this.id = undefined;
        }
    }
}
