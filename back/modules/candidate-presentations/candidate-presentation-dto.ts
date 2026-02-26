import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../models/dto/base.dto';

export class CandidatePresentationDto extends BaseDto {
    @ApiProperty({ required: true })
    title: string;

    @ApiProperty({ required: false })
    content?: string;

    @ApiProperty({ required: true })
    candidateId: string;

    @ApiProperty({ required: false })
    isDefault?: boolean;

    @ApiProperty({ required: false })
    displayOrder?: number;
}
