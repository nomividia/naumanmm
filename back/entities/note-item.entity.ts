import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { NoteItemDto } from '../models/dto/note-item.dto';
import { Candidate } from '../modules/candidates/candidate.entity';
import { AppBaseEntity } from './base-entity';
import { NoteItemFile } from './note-item-file.entity';
import { User } from './user.entity';

@Entity({ name: 'note-item' })
export class NoteItem extends AppBaseEntity {
    @Column('text', { name: 'content', nullable: false })
    content?: string;

    @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'consultantId' })
    consultant?: User;

    @Column('varchar', { name: 'consultantId', length: 36, nullable: true })
    consultantId: string;

    @ManyToOne(() => Candidate, (candidate) => candidate.noteItems, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    @Column('varchar', { name: 'candidateId', length: 36, nullable: true })
    candidateId: string;

    @OneToMany(() => NoteItemFile, (file) => file.noteItem, { cascade: true })
    files?: NoteItemFile[];

    toDto(): NoteItemDto {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            consultantId: this.consultantId,
            content: this.content,
            candidateId: this.candidateId,
            consultant: this.consultant ? this.consultant.toDto(false) : null,
            candidate: this.candidate ? this.candidate.toDto() : null,
            files: this.files?.map((f) => f.toDto()) || [],
        };
    }

    fromDto(dto: NoteItemDto) {
        this.id = dto.id;
        this.consultantId = dto.consultantId;
        this.content = dto.content;
        this.candidateId = dto.candidateId;

        if (dto.files?.length) {
            this.files = dto.files.map((f) => {
                const file = new NoteItemFile();
                file.fromDto(f);
                return file;
            });
        }

        //used for data migration only
        this.modifDate = dto.modifDate;
        if (!dto.id) this.id = undefined;
    }
}
