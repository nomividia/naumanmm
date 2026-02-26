import { CandidateMessageSenderType } from '../../../shared/shared-constants';
import { AppBaseEntity } from '../../entities/base-entity';
import { User } from '../../entities/user.entity';
import { Candidate } from '../candidates/candidate.entity';
import { CandidateMessageDto } from './candidate-message-dto';
export declare class CandidateMessage extends AppBaseEntity {
    content: string;
    candidateId: string;
    candidate: Candidate;
    senderId: string;
    sender: User;
    seen: boolean;
    senderType: CandidateMessageSenderType;
    archived: boolean;
    toDto(): CandidateMessageDto;
    fromDto(dto: CandidateMessageDto): void;
}
