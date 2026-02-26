import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CandidateMessageSenderType } from '../../../shared/shared-constants';
import { AppBaseEntity } from '../../entities/base-entity';
import { User } from '../../entities/user.entity';
import { Candidate } from '../candidates/candidate.entity';
import { CandidateMessageDto } from './candidate-message-dto';

@Entity({ name: 'candidate-messages' })
export class CandidateMessage extends AppBaseEntity {
    @Column('text', { name: 'content', nullable: false })
    content: string;

    @Column('varchar', { name: 'candidateId', nullable: false, length: 36 })
    candidateId: string;
    @ManyToOne(() => Candidate, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'candidateId' })
    candidate: Candidate;

    @Column('varchar', { name: 'senderId', nullable: false, length: 36 })
    senderId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @Column('boolean', { name: 'seen', nullable: false, default: 0 })
    seen: boolean;

    @Column('varchar', { name: 'senderType', nullable: false })
    senderType: CandidateMessageSenderType;

    @Column('boolean', { name: 'archived', nullable: false, default: false })
    archived: boolean;

    public toDto(): CandidateMessageDto {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,

            content: this.content,
            seen: this.seen,
            senderType: this.senderType,

            candidateId: this.candidateId,
            senderId: this.senderId,

            candidate: this.candidate?.toDto(),
            sender: this.sender?.toDto(),
            archived: this.archived,
        };
    }

    public fromDto(dto: CandidateMessageDto) {
        this.id = dto.id;

        this.content = dto.content;
        this.senderType = dto.senderType;

        this.candidateId = dto.candidateId;
        this.senderId = dto.senderId;

        this.archived = dto.archived;

        if (!this.id) {
            this.id = undefined;
        }
    }
}
