import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppValue } from '../../../entities/app-value.entity';
import { AppBaseEntity } from '../../../entities/base-entity';
import { Candidate } from '../candidate.entity';
import { CandidateLanguageDto } from './candidate-language.dto';

@Entity({ name: 'candidate-language' })
export class CandidateLanguage extends AppBaseEntity {
    @Column('varchar', { name: 'languageCode', nullable: false, length: 14 })
    languageCode?: string;

    @ManyToOne(() => Candidate, (candidate) => candidate.candidateLanguages, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'levelLanguageId' })
    levelLanguage?: AppValue;

    @Column('varchar', { name: 'candidateId', nullable: true, length: 36 })
    candidateId?: string;

    @Column('varchar', { name: 'levelLanguageId', length: 36, nullable: true })
    levelLanguageId?: string;

    @Column('bool', { name: 'isPartnerLanguage', nullable: true })
    isPartnerLanguage?: boolean;

    toDto(): CandidateLanguageDto {
        return {
            id: this.id,
            candidateId: this.candidateId,
            levelLanguageId: this.levelLanguageId,
            candidate: this.candidate ? this.candidate.toDto() : null,
            levelLanguage: this.levelLanguage
                ? this.levelLanguage.toDto()
                : null,
            languageCode: this.languageCode,
            isPartnerLanguage: this.isPartnerLanguage,
        };
    }

    fromDto(dto: CandidateLanguageDto) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.levelLanguageId = dto.levelLanguageId;
        this.languageCode = dto.languageCode;
        this.isPartnerLanguage = dto.isPartnerLanguage;
    }
}
