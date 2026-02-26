import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppFile } from '../../entities/app-file.entity';
import { AppValue } from '../../entities/app-value.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { CandidateFileDto } from './candidate-file-dto';
import { Candidate } from './candidate.entity';

@Entity({ name: 'candidates-files' })
export class CandidateFile extends AppBaseEntity {
    @Column('varchar', { name: 'fileId', nullable: true, length: 36 })
    fileId?: string;

    @ManyToOne(() => AppFile, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'fileId' })
    file?: AppFile;

    @Column('varchar', { name: 'candidateId', nullable: true, length: 36 })
    candidateId?: string;

    @ManyToOne(() => Candidate, (candidate) => candidate.files, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    @Column('varchar', { name: 'fileTypeId', nullable: true, length: 36 })
    fileTypeId?: string;

    @ManyToOne(() => AppValue, { orphanedRowAction: 'delete' })
    @JoinColumn({ name: 'fileTypeId' })
    fileType?: AppValue;

    @Column('boolean', { name: 'isMandatory', nullable: false, default: 0 })
    isMandatory?: boolean;

    public toDto(): CandidateFileDto {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            candidateId: this.candidateId,
            fileId: this.fileId,
            fileTypeId: this.fileTypeId,
            fileType: this.fileType?.toDto(),
            file: this.file?.toDto(),
            candidate: this.candidate?.toDto(),
            isMandatory: this.isMandatory,
        };
    }

    public fromDto(dto: CandidateFileDto) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.fileId = dto.fileId;
        this.fileTypeId = dto.fileTypeId;
        this.isMandatory = dto.isMandatory;

        if (dto.file) {
            this.file = new AppFile();
            this.file.fromDto(dto.file);
        }

        if (!this.id) {
            this.id = undefined;
        }
    }
}
