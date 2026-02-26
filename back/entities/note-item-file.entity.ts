import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppFile } from './app-file.entity';
import { AppBaseEntity } from './base-entity';
import { NoteItem } from './note-item.entity';
import { NoteItemFileDto } from '../models/dto/note-item-file.dto';

@Entity({ name: 'note-item-files' })
export class NoteItemFile extends AppBaseEntity {
    @Column('varchar', { name: 'fileId', nullable: true, length: 36 })
    fileId?: string;

    @ManyToOne(() => AppFile, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'fileId' })
    file?: AppFile;

    @Column('varchar', { name: 'noteItemId', nullable: true, length: 36 })
    noteItemId?: string;

    @ManyToOne(() => NoteItem, (noteItem) => noteItem.files, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    @JoinColumn({ name: 'noteItemId' })
    noteItem?: NoteItem;

    public toDto(): NoteItemFileDto {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            noteItemId: this.noteItemId,
            fileId: this.fileId,
            file: this.file?.toDto(),
        };
    }

    public fromDto(dto: NoteItemFileDto) {
        this.id = dto.id;
        this.noteItemId = dto.noteItemId;
        this.fileId = dto.fileId;

        if (dto.file) {
            this.file = new AppFile();
            this.file.fromDto(dto.file);
        }

        if (!this.id) {
            this.id = undefined;
        }
    }
}
