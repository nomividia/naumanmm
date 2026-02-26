import { ApiPropertyOptional } from '@nestjs/swagger';
import { CandidateDto } from '../../modules/candidates/candidate-dto';
import { NoteItemFileDto } from './note-item-file.dto';
import { UserDto } from './user-dto';

export class NoteItemDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional()
    creationDate?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    modifDate?: Date;

    @ApiPropertyOptional()
    content?: string;

    @ApiPropertyOptional({ type: () => UserDto })
    consultant?: UserDto;

    @ApiPropertyOptional()
    consultantId?: string;

    @ApiPropertyOptional()
    candidateId?: string;

    @ApiPropertyOptional({ type: () => CandidateDto })
    candidate?: CandidateDto;

    @ApiPropertyOptional({ type: () => NoteItemFileDto, isArray: true })
    files?: NoteItemFileDto[];
}
