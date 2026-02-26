import { CandidateMessageSenderType } from '../../../shared/shared-constants';
import { UserDto } from '../../models/dto/user-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
import { CandidateDto } from '../candidates/candidate-dto';
export declare class CandidateMessageDto {
    id?: string;
    creationDate?: Date;
    modifDate?: Date;
    content: string;
    candidateId?: string;
    candidate?: CandidateDto;
    seen?: boolean;
    senderId?: string;
    sender?: UserDto;
    senderType?: CandidateMessageSenderType;
    archived?: boolean;
}
export declare class GetCandidateMessageResponse extends GenericResponse {
    candidateMessage: CandidateMessageDto;
}
export declare class GetCandidateMessagesResponse extends BaseSearchResponse {
    candidateMessages: CandidateMessageDto[];
    unSeenMessagesCount: number;
}
export declare class GetCandidateMessagesRequest extends BaseSearchRequest {
    candidateId?: string;
}
export declare class GetConsultantMessagesRequest extends BaseSearchRequest {
    consultantId?: string;
}
