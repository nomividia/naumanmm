import { CandidateDto } from '../../modules/candidates/candidate-dto';
import { NoteItemFileDto } from './note-item-file.dto';
import { UserDto } from './user-dto';
export declare class NoteItemDto {
    id?: string;
    creationDate?: Date;
    modifDate?: Date;
    content?: string;
    consultant?: UserDto;
    consultantId?: string;
    candidateId?: string;
    candidate?: CandidateDto;
    files?: NoteItemFileDto[];
}
