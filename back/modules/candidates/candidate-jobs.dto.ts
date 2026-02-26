import { ApiPropertyOptional } from '@nestjs/swagger';
import { CandidateJobStatus } from '../../../shared/types/candidate-job-status.type';
import { CandidateJobType } from '../../../shared/types/candidate-job-type';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { JobReferenceDto } from '../job-references/job-reference-dto';
import { CandidateDto } from './candidate-dto';

export class CandidateJobDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public creationDate?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public modifDate?: Date;

    @ApiPropertyOptional()
    candidateId?: string;

    @ApiPropertyOptional({ type: () => CandidateDto })
    candidate?: CandidateDto;

    @ApiPropertyOptional()
    candidateResumeId?: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    job?: AppValueDto;

    @ApiPropertyOptional()
    jobId?: string;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    experienceStartDate?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    experienceEndDate?: Date;

    @ApiPropertyOptional()
    showMonthInResume?: boolean;

    @ApiPropertyOptional()
    postTitle?: string;

    @ApiPropertyOptional()
    postDescription?: string;

    @ApiPropertyOptional()
    postResponsability?: string;

    @ApiPropertyOptional()
    employer?: string;

    @ApiPropertyOptional()
    inActivity?: boolean;

    @ApiPropertyOptional()
    leavingReason?: string;

    @ApiPropertyOptional({ type: () => JobReferenceDto })
    jobReference?: JobReferenceDto;

    @ApiPropertyOptional()
    jobReferenceId?: string;

    @ApiPropertyOptional()
    employerProfileId?: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    employerProfile?: AppValueDto;

    @ApiPropertyOptional()
    jobName?: string;

    @ApiPropertyOptional()
    jobDescription?: string;

    @ApiPropertyOptional({ enum: CandidateJobStatus })
    status: CandidateJobStatus;

    @ApiPropertyOptional({ enum: CandidateJobType })
    type: CandidateJobType;
}
