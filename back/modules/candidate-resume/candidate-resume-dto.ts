import { ApiProperty } from '@nestjs/swagger';

export class GenerateCandidateResumeDto {
    @ApiProperty({ required: true, enum: ['fr', 'en'] })
    language: 'fr' | 'en';

    @ApiProperty({ required: true })
    showAge: boolean;

    @ApiProperty({ required: true })
    showNationality: boolean;

    @ApiProperty({ required: true })
    selectedJobId: string;

    @ApiProperty({ required: false })
    selectedPresentationId?: string;
}
