import { AppFileDto } from './app-file-dto';
export declare class NoteItemFileDto {
    id?: string;
    creationDate?: Date;
    modifDate?: Date;
    fileId?: string;
    file?: AppFileDto;
    noteItemId?: string;
}
