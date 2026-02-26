import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CandidateMessageSenderType } from '../../../shared/shared-constants';
import { UserDto } from '../../models/dto/user-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
import { CandidateDto } from '../candidates/candidate-dto';

export class CandidateMessageDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    creationDate?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    modifDate?: Date;

    @ApiProperty()
    content: string;

    @ApiPropertyOptional()
    candidateId?: string;

    @ApiPropertyOptional({ type: () => CandidateDto })
    candidate?: CandidateDto;

    @ApiPropertyOptional()
    seen?: boolean;

    @ApiPropertyOptional()
    senderId?: string;

    @ApiPropertyOptional({ type: () => UserDto })
    sender?: UserDto;

    @ApiPropertyOptional({ type: () => String })
    senderType?: CandidateMessageSenderType;

    @ApiPropertyOptional()
    archived?: boolean;
}

export class GetCandidateMessageResponse extends GenericResponse {
    @ApiProperty({ type: () => CandidateMessageDto })
    candidateMessage: CandidateMessageDto;
}

export class GetCandidateMessagesResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => CandidateMessageDto, isArray: true })
    candidateMessages: CandidateMessageDto[] = [];

    @ApiProperty()
    unSeenMessagesCount: number;
}

export class GetCandidateMessagesRequest extends BaseSearchRequest {
    @ApiPropertyOptional({
        description: 'filter candidate message by candidate',
    })
    candidateId?: string;
}

export class GetConsultantMessagesRequest extends BaseSearchRequest {
    @ApiPropertyOptional({
        description: 'filter candidate message by candidate',
    })
    consultantId?: string;
}
