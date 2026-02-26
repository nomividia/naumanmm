import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobOfferDto } from '../../job-offers/job-offer-dto';
import { CandidateDto } from '../candidate-dto';
import { CandidateFileDto } from '../candidate-file-dto';
import { CandidateJobOfferAction } from './candidate-job-offer-history.entity';

export class CandidateJobOfferHistoryDto {
    @ApiProperty()
    id?: string;

    @ApiProperty()
    candidateId: string;

    @ApiProperty()
    candidate?: CandidateDto;

    @ApiProperty()
    jobOfferId: string;

    @ApiProperty()
    jobOffer?: JobOfferDto;

    @ApiProperty({ enum: CandidateJobOfferAction })
    action: CandidateJobOfferAction;

    @ApiProperty()
    candidateFirstName: string;

    @ApiProperty()
    candidateLastName: string;

    @ApiProperty()
    actionDate: Date;

    @ApiProperty({ required: false })
    startDate?: Date;

    @ApiProperty({ required: false })
    contractFileId?: string;

    @ApiProperty({ required: false })
    contractFile?: CandidateFileDto;

    @ApiProperty()
    creationDate?: Date;

    @ApiProperty()
    modifDate?: Date;
}

export class CreateCandidateJobOfferHistoryRequest {
    @ApiProperty()
    candidateId: string;

    @ApiProperty()
    jobOfferId: string;

    @ApiProperty({ enum: CandidateJobOfferAction })
    action: CandidateJobOfferAction;

    @ApiProperty()
    candidateFirstName: string;

    @ApiProperty()
    candidateLastName: string;

    @ApiProperty({ required: false })
    startDate?: Date;

    @ApiProperty({ required: false })
    contractFileId?: string;
}

export class GetCandidateJobOfferHistoryRequest {
    @ApiPropertyOptional()
    jobOfferId?: string;

    @ApiPropertyOptional()
    candidateId?: string;

    @ApiPropertyOptional()
    start?: number;

    @ApiPropertyOptional()
    length?: number;

    @ApiPropertyOptional()
    orderby?: string;

    @ApiPropertyOptional()
    order?: string;
}
