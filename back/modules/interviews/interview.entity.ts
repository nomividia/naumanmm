import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MMIAgencyCode } from '../../../shared/interview-helpers';
import { InterviewConfirmationStatus } from '../../../shared/shared-constants';
import { AppBaseEntity } from '../../entities/base-entity';
import { User } from '../../entities/user.entity';
import { Candidate } from '../candidates/candidate.entity';
import { InterviewDto } from './interview-dto';

@Entity({ name: 'interviews' })
export class Interview extends AppBaseEntity {
    @Column('varchar', { name: 'title', nullable: false })
    title: string;

    @Column('datetime', { name: 'date', nullable: false })
    date: Date;

    @Column('text', { name: 'comment', nullable: true })
    comment?: string;

    @Column('varchar', { name: 'candidateId', nullable: true, length: 36 })
    candidateId: string;

    @ManyToOne(() => Candidate, (candidate) => candidate.interviews, {
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'candidateId' })
    candidate: Candidate;

    @Column('varchar', { name: 'consultantId', nullable: true, length: 36 })
    consultantId: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'consultantId' })
    consultant: User;

    @Column('varchar', { name: 'agencyPlace', nullable: true, length: '80' })
    agencyPlace?: MMIAgencyCode;

    @Column('varchar', { name: 'guid', nullable: true, length: 36 })
    guid?: string;

    @Column('enum', {
        name: 'candidateResponse',
        nullable: true,
        enum: InterviewConfirmationStatus,
    })
    candidateResponse?: InterviewConfirmationStatus;

    @Column('boolean', { name: 'noShow', nullable: false, default: false })
    noShow: boolean;

    public toDto(): InterviewDto {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            title: this.title,
            date: this.date,
            comment: this.comment,
            candidateId: this.candidateId,
            candidate: this.candidate?.toDto(),
            consultantId: this.consultantId,
            consultant: this.consultant ? this.consultant.toDto() : undefined,
            guid: this.guid,
            candidateResponse: this.candidateResponse,
            agencyPlace: this.agencyPlace,
            noShow: this.noShow,
        };
    }

    public fromDto(dto: InterviewDto) {
        this.id = dto.id;

        this.title = dto.title;
        this.date = dto.date;
        this.comment = dto.comment;

        this.candidateId = dto.candidateId;
        this.consultantId = dto.consultantId;
        this.guid = dto.guid;
        this.candidateResponse = dto.candidateResponse;
        this.agencyPlace = 'visio'; // Legacy field - always set to visio
        this.noShow = dto.noShow ?? false;

        if (!this.id) {
            this.id = undefined;
        }
    }
}
