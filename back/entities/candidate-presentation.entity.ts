import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CandidatePresentationDto } from '../modules/candidate-presentations/candidate-presentation-dto';
import { Candidate } from '../modules/candidates/candidate.entity';
import { AppBaseEntity } from './base-entity';

@Entity({ name: 'candidate_presentations' })
export class CandidatePresentation extends AppBaseEntity {
    @Column('varchar', { name: 'title', length: 255 })
    title: string;

    @Column('text', { name: 'content', nullable: true })
    content?: string;

    @ManyToOne(() => Candidate, (candidate) => candidate.presentations, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    @Column('varchar', { name: 'candidateId', length: 36 })
    candidateId: string;

    @Column('boolean', { name: 'isDefault', default: false })
    isDefault?: boolean;

    @Column('int', { name: 'displayOrder', nullable: true })
    displayOrder?: number;

    public toDto(): CandidatePresentationDto {
        return {
            id: this.id,
            title: this.title,
            content: this.content,
            candidateId: this.candidateId,
            isDefault: this.isDefault,
            displayOrder: this.displayOrder,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            disabled: this.disabled,
        };
    }

    public fromDto(dto: CandidatePresentationDto) {
        this.id = dto.id;
        this.title = dto.title;
        this.content = dto.content;
        this.candidateId = dto.candidateId;
        this.isDefault = dto.isDefault;
        this.displayOrder = dto.displayOrder;
        this.disabled = dto.disabled;

        if (!this.id) this.id = undefined;
    }
}
