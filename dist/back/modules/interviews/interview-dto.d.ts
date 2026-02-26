import { MMIAgencyCode } from '../../../shared/interview-helpers';
import { InterviewConfirmationStatus } from '../../../shared/shared-constants';
import { UserDto } from '../../models/dto/user-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
import { CandidateDto } from '../candidates/candidate-dto';
export declare class InterviewDto {
    id?: string;
    creationDate?: Date;
    modifDate?: Date;
    candidateId: string;
    candidate?: CandidateDto;
    date?: Date;
    title?: string;
    comment?: string;
    consultantId?: string;
    consultant?: UserDto;
    guid?: string;
    candidateResponse?: InterviewConfirmationStatus;
    agencyPlace?: MMIAgencyCode;
    noShow?: boolean;
}
export declare class GetInterviewResponse extends GenericResponse {
    interview: InterviewDto;
}
export declare class SaveInterviewResponseResponse extends GetInterviewResponse {
    alreadyAccepted: boolean;
    alreadyRefused: boolean;
}
export declare class GetInterviewsResponse extends BaseSearchResponse {
    interviews: InterviewDto[];
}
export declare class CheckCandidatesInterviewEligibilityRequest {
    candidateIds: string[];
}
export declare class CandidateInterviewEligibility {
    candidateId: string;
    isEligible: boolean;
    lastInterviewDate?: Date;
}
export declare class CheckCandidatesInterviewEligibilityResponse extends GenericResponse {
    eligibilities: CandidateInterviewEligibility[];
}
export declare class GetInterviewsRequest extends BaseSearchRequest {
    candidateId?: string;
    interviewFilterMonth: string;
    interviewFilterYear: string;
    interviewCurrentDate: 'past' | 'coming';
    interviewPlace: MMIAgencyCode;
    interviewConfirmationStatus?: InterviewConfirmationStatus;
    noShow?: boolean;
}
