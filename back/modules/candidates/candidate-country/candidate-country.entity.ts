import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../../entities/base-entity';
import { CandidateApplication } from '../../candidates-application/candidate-application.entity';
import { Candidate } from '../candidate.entity';
import { CandidateCountryDto } from './candidate-country.dto';

@Entity({ name: 'candidate-country' })
export class CandidateCountry extends AppBaseEntity {
    @Column('varchar', { name: 'candidateId', length: 36, nullable: true })
    candidateId?: string;

    @ManyToOne(() => Candidate, (candidate) => candidate.candidateCountries, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    @Column('varchar', {
        name: 'candidateApplicationId',
        length: 36,
        nullable: true,
    })
    candidateApplicationId?: string;

    @ManyToOne(
        () => CandidateApplication,
        (candidateApplication) => candidateApplication.candidateCountries,
        {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            orphanedRowAction: 'delete',
        },
    )
    @JoinColumn({ name: 'candidateApplicationId' })
    candidateApplication?: CandidateApplication;

    @Column('varchar', { name: 'country', length: 255, nullable: false })
    country?: string;

    toDto(): CandidateCountryDto {
        return {
            id: this.id,
            candidateId: this.candidateId,
            candidate: this.candidate ? this.candidate.toDto() : null,
            country: this.country,
            candidateApplicationId: this.candidateApplicationId,
            candidateApplication: this.candidateApplication
                ? this.candidateApplication.toDto()
                : null,
        };
    }

    fromDto(dto: CandidateCountryDto) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.country = dto.country;
        this.candidateApplicationId = dto.candidateApplicationId;
    }
}
