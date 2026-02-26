import { NoteItemDto } from '../models/dto/note-item.dto';
import { Candidate } from '../modules/candidates/candidate.entity';
import { AppBaseEntity } from './base-entity';
import { NoteItemFile } from './note-item-file.entity';
import { User } from './user.entity';
export declare class NoteItem extends AppBaseEntity {
    content?: string;
    consultant?: User;
    consultantId: string;
    candidate?: Candidate;
    candidateId: string;
    files?: NoteItemFile[];
    toDto(): NoteItemDto;
    fromDto(dto: NoteItemDto): void;
}
