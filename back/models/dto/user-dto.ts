import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class UserDto extends BaseDto {
    @ApiProperty()
    userName: string;

    @ApiPropertyOptional()
    password?: string;

    @ApiPropertyOptional({ type: () => UserRoleDto, isArray: true })
    roles?: UserRoleDto[];

    @ApiPropertyOptional()
    rolesString?: string[];

    @ApiPropertyOptional()
    mail?: string;

    @ApiPropertyOptional()
    phone?: string;

    @ApiPropertyOptional()
    phoneFix?: string;

    @ApiPropertyOptional()
    pushSubscriptions?: PushSubscriptionDto[];

    @ApiPropertyOptional()
    languageId: string;

    @ApiPropertyOptional()
    language?: LanguageDto;

    @ApiPropertyOptional()
    presentation?: string;

    @ApiPropertyOptional({ type: () => TranslationDto, isArray: true })
    translations?: TranslationDto[];

    @ApiPropertyOptional()
    firstName?: string;

    @ApiPropertyOptional()
    lastName?: string;

    @ApiPropertyOptional()
    facebookUserId?: string;

    @ApiPropertyOptional()
    googleUserId?: string;

    @ApiPropertyOptional({ type: () => AppFileDto })
    public image?: AppFileDto;

    @ApiPropertyOptional()
    public imageId?: string;

    @ApiPropertyOptional()
    recoverToken?: string;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    recoverTokenExpirationDate?: Date;

    @ApiPropertyOptional()
    refreshToken?: string;

    @ApiPropertyOptional({ type: () => CandidateDto })
    candidate?: CandidateDto;

    @ApiPropertyOptional()
    candidateId?: string;

    @ApiPropertyOptional()
    genderId?: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    gender?: AppValueDto;

    @ApiPropertyOptional()
    TOSAccepted?: boolean;

    @ApiPropertyOptional()
    loginToken?: string;
}

export class GetUserResponse extends GenericResponse {
    @ApiProperty()
    user: UserDto = null;
}

export class GetUsersResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => UserDto, isArray: true })
    users: UserDto[] = [];
}

export class GetHasUserAcceptedTOSResponse extends GenericResponse {
    @ApiProperty()
    hasAcceptedTOS: boolean;
}

export class GetUserStatsResponse extends GenericResponse {
    @ApiProperty()
    jobOfferLinked: number;

    @ApiProperty()
    candidatePlaced: number;

    @ApiProperty()
    candidateLinked: number;
}

export class GetConnectedConsultantsResponse extends GenericResponse {
    @ApiProperty()
    connectedConsultants: number = 0;
}
