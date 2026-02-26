import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobHistoryDto } from './job-history-dto';

export class JobDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional()
    cronPattern?: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    methodName: string;

    @ApiPropertyOptional()
    applicationServiceName?: string;

    @ApiPropertyOptional()
    description?: string;

    @ApiPropertyOptional({ type: () => JobHistoryDto, isArray: true })
    jobHistory?: JobHistoryDto[];

    @ApiProperty()
    enabled: boolean;

    @ApiPropertyOptional()
    logHistory?: boolean;

    @ApiPropertyOptional()
    modulePath?: string;

    @ApiPropertyOptional()
    moduleName?: string;

    @ApiPropertyOptional()
    servicePath?: string;
}
