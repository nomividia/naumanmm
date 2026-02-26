import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AnonymousMessageSenderType } from '../../../shared/shared-constants';
import { AppFile } from '../../entities/app-file.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { User } from '../../entities/user.entity';
import { CandidateApplication } from '../candidates-application/candidate-application.entity';
import { AnonymousExchangeDto } from './anonymous-exchange.dto';

@Entity({ name: 'anonymous-exchanges' })
export class AnonymousExchange extends AppBaseEntity {
    @Column('varchar', {
        name: 'candidateApplicationId',
        nullable: false,
        length: 36,
    })
    candidateApplicationId: string;

    @ManyToOne(() => CandidateApplication, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'candidateApplicationId' })
    candidateApplication: CandidateApplication;

    @Column('text', { name: 'messageContent', nullable: false })
    messageContent: string;

    @Column('varchar', { name: 'consultantId', nullable: true, length: 36 })
    consultantId?: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'consultantId' })
    consultant: User;

    @Column('boolean', { name: 'seen', nullable: false, default: 0 })
    seen: boolean;

    @Column('enum', {
        name: 'senderType',
        nullable: false,
        enum: AnonymousMessageSenderType,
        enumName: 'AnonymousMessageSenderType',
    })
    senderType: AnonymousMessageSenderType;

    @Column('varchar', { name: 'fileId', nullable: true, length: 36 })
    fileId?: string;

    @OneToOne(() => AppFile, { cascade: true })
    @JoinColumn({ name: 'fileId' })
    file?: AppFile;

    public toDto(): AnonymousExchangeDto {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            messageContent: this.messageContent,
            seen: this.seen,
            senderType: this.senderType,
            candidateApplicationId: this.candidateApplicationId,
            candidateApplication: this.candidateApplication?.toDto(),
            consultantId: this.consultantId,
            consultant: this.consultant?.toDto(),
            file: this.file ? this.file.toDto() : undefined,
            fileId: this.fileId,
        };
    }

    public fromDto(dto: AnonymousExchangeDto) {
        this.id = dto.id;
        this.messageContent = dto.messageContent;
        this.senderType = dto.senderType;
        this.candidateApplicationId = dto.candidateApplicationId;
        this.consultantId = dto.consultantId;
        this.fileId = dto.fileId;

        if (!this.id) {
            this.id = undefined;
        }
    }
}
