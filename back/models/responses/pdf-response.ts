import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { GenericResponse } from './generic-response';

export class GeneratePDFResponse extends GenericResponse {
    @ApiProperty()
    fullPath: string;

    @ApiHideProperty()
    fullLocalPath: string;

    @ApiProperty()
    fileName: string;
}
