import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobDto } from './job-dto';

export class JobHistoryDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional({ type: () => JobDto })
    public job: JobDto;

    @ApiProperty({ type: String, format: 'date-time' })
    date: Date;

    @ApiProperty()
    jobId: string;

    @ApiPropertyOptional()
    result?: string;

    @ApiProperty()
    duration?: number; //in ms
}
