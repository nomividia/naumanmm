import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../../entities/base-entity';
import { JobOffer } from '../../job-offers/job-offer.entity';
import { Candidate } from '../candidate.entity';
import { CandidateFile } from '../candidate-file.entity';

export enum CandidateJobOfferAction {
    LINKED = 'LINKED',
    UNLINKED = 'UNLINKED',
}

@Entity({ name: 'candidate-job-offer-history' })
export class CandidateJobOfferHistory extends AppBaseEntity {
    @Column('varchar', { name: 'candidateId', nullable: false, length: 36 })
    candidateId: string;

    @ManyToOne(() => Candidate, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    @Column('varchar', { name: 'jobOfferId', nullable: false, length: 36 })
    jobOfferId: string;

    @ManyToOne(() => JobOffer, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'jobOfferId' })
    jobOffer?: JobOffer;

    @Column('enum', {
        name: 'action',
        nullable: false,
        enum: CandidateJobOfferAction,
        enumName: 'CandidateJobOfferAction',
    })
    action: CandidateJobOfferAction;

    @Column('varchar', {
        name: 'candidateFirstName',
        nullable: true,
        length: 130,
    })
    candidateFirstName: string;

    @Column('varchar', {
        name: 'candidateLastName',
        nullable: true,
        length: 130,
    })
    candidateLastName: string;

    @Column('datetime', { name: 'actionDate', nullable: false })
    actionDate: Date;

    @Column('date', { name: 'startDate', nullable: true })
    startDate: Date;

    @Column('varchar', { name: 'contractFileId', nullable: true, length: 36 })
    contractFileId: string;

    @ManyToOne(() => CandidateFile, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'contractFileId' })
    contractFile?: CandidateFile;

    public toDto() {
        return {
            id: this.id,
            candidateId: this.candidateId,
            candidate: this.candidate?.toDto(),
            jobOfferId: this.jobOfferId,
            jobOffer: this.jobOffer?.toDto(),
            action: this.action,
            candidateFirstName: this.candidateFirstName,
            candidateLastName: this.candidateLastName,
            actionDate: this.actionDate,
            startDate: this.startDate,
            contractFileId: this.contractFileId,
            contractFile: this.contractFile?.toDto(),
            creationDate: this.creationDate,
            modifDate: this.modifDate,
        };
    }

    public fromDto(dto: any) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.jobOfferId = dto.jobOfferId;
        this.action = dto.action;
        this.candidateFirstName = dto.candidateFirstName;
        this.candidateLastName = dto.candidateLastName;
        this.actionDate = dto.actionDate;
        this.startDate = dto.startDate;
        this.contractFileId = dto.contractFileId;

        if (!this.id) {
            this.id = undefined;
        }
    }
}
