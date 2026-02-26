import { ApiProperty } from '@nestjs/swagger';
import { GenericResponse } from './generic-response';

export class GetLogFileContentResponse extends GenericResponse {
    @ApiProperty()
    content: string;
}
