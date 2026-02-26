import { CandidateDto } from '../../modules/candidates/candidate-dto';
import { BaseSearchResponse } from '../responses/base-search-responses';
import { GenericResponse } from '../responses/generic-response';
import { AppFileDto } from './app-file-dto';
import { AppValueDto } from './app-value-dto';
import { BaseDto } from './base.dto';
import { LanguageDto } from './language-dto';
import { PushSubscriptionDto } from './push-subscription-dto';
import { TranslationDto } from './translation-dto';
import { UserRoleDto } from './user-role-dto';
export declare class UserDto extends BaseDto {
    userName: string;
    password?: string;
    roles?: UserRoleDto[];
    rolesString?: string[];
    mail?: string;
    phone?: string;
    phoneFix?: string;
    pushSubscriptions?: PushSubscriptionDto[];
    languageId: string;
    language?: LanguageDto;
    presentation?: string;
    translations?: TranslationDto[];
    firstName?: string;
    lastName?: string;
    facebookUserId?: string;
    googleUserId?: string;
    image?: AppFileDto;
    imageId?: string;
    recoverToken?: string;
    recoverTokenExpirationDate?: Date;
    refreshToken?: string;
    candidate?: CandidateDto;
    candidateId?: string;
    genderId?: string;
    gender?: AppValueDto;
    TOSAccepted?: boolean;
    loginToken?: string;
}
export declare class GetUserResponse extends GenericResponse {
    user: UserDto;
}
export declare class GetUsersResponse extends BaseSearchResponse {
    users: UserDto[];
}
export declare class GetHasUserAcceptedTOSResponse extends GenericResponse {
    hasAcceptedTOS: boolean;
}
export declare class GetUserStatsResponse extends GenericResponse {
    jobOfferLinked: number;
    candidatePlaced: number;
    candidateLinked: number;
}
export declare class GetConnectedConsultantsResponse extends GenericResponse {
    connectedConsultants: number;
}
