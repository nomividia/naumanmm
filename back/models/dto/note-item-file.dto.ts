import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppFileDto } from './app-file-dto';

export class NoteItemFileDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public creationDate?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public modifDate?: Date;

    @ApiPropertyOptional()
    fileId?: string;

    @ApiPropertyOptional({ type: () => AppFileDto })
    file?: AppFileDto;

    @ApiPropertyOptional()
    noteItemId?: string;
}
