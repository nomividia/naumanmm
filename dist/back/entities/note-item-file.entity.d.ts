import { AppFile } from './app-file.entity';
import { AppBaseEntity } from './base-entity';
import { NoteItem } from './note-item.entity';
import { NoteItemFileDto } from '../models/dto/note-item-file.dto';
export declare class NoteItemFile extends AppBaseEntity {
    fileId?: string;
    file?: AppFile;
    noteItemId?: string;
    noteItem?: NoteItem;
    toDto(): NoteItemFileDto;
    fromDto(dto: NoteItemFileDto): void;
}
