import { AnonymousMessageSenderType } from '../../../shared/shared-constants';
import { AppFileDto } from '../../models/dto/app-file-dto';
import { BaseDto } from '../../models/dto/base.dto';
import { UserDto } from '../../models/dto/user-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { CandidateApplicationDto } from '../candidates-application/candidate-application-dto';
export declare class AnonymousExchangeDto extends BaseDto {
    candidateApplicationId: string;
    candidateApplication?: CandidateApplicationDto;
    consultantId?: string;
    consultant?: UserDto;
    messageContent: string;
    seen?: boolean;
    senderType: AnonymousMessageSenderType;
    fileId?: string;
    file?: AppFileDto;
}
export declare class GetAnonymousExchangeForCandidateApplicationResponse extends BaseSearchResponse {
    exchange: AnonymousExchangeDto;
}
export declare class GetAnonymousExchangesForCandidateApplicationResponse extends BaseSearchResponse {
    exchanges: AnonymousExchangeDto[];
    unSeenMessagesCount: number;
}
export declare class GetAnonymousExchangeForCandidateApplicationRequest extends BaseSearchRequest {
    candidateApplicationId?: string;
}
