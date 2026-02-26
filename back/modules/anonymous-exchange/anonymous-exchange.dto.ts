import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AnonymousMessageSenderType } from '../../../shared/shared-constants';
import { AppFileDto } from '../../models/dto/app-file-dto';
import { BaseDto } from '../../models/dto/base.dto';
import { UserDto } from '../../models/dto/user-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { CandidateApplicationDto } from '../candidates-application/candidate-application-dto';

export class AnonymousExchangeDto extends BaseDto {
    @ApiProperty()
    candidateApplicationId: string;

    @ApiPropertyOptional({ type: () => CandidateApplicationDto })
    candidateApplication?: CandidateApplicationDto;

    @ApiPropertyOptional()
    consultantId?: string;

    @ApiPropertyOptional({ type: () => UserDto })
    consultant?: UserDto;

    @ApiProperty()
    messageContent: string;

    @ApiPropertyOptional()
    seen?: boolean;

    @ApiPropertyOptional({
        enum: AnonymousMessageSenderType,
        enumName: 'AnonymousMessageSenderType',
    })
    senderType: AnonymousMessageSenderType;

    @ApiPropertyOptional()
    fileId?: string;

    @ApiPropertyOptional({ type: () => AppFileDto })
    file?: AppFileDto;
}

export class GetAnonymousExchangeForCandidateApplicationResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => AnonymousExchangeDto })
    exchange: AnonymousExchangeDto;
}

export class GetAnonymousExchangesForCandidateApplicationResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => AnonymousExchangeDto, isArray: true })
    exchanges: AnonymousExchangeDto[] = [];

    @ApiProperty()
    unSeenMessagesCount: number;
}

export class GetAnonymousExchangeForCandidateApplicationRequest extends BaseSearchRequest {
    @ApiPropertyOptional({
        description: 'filter anonymous exchange by candidate application',
    })
    candidateApplicationId?: string;
}
