import { Column, Entity } from 'typeorm';
import { AppFileType } from '../../shared/shared-constants';
import { AppFileDto } from '../models/dto/app-file-dto';
import { BaseFile } from './base-file.entity';

@Entity({ name: 'app_files' })
export class AppFile extends BaseFile {
    @Column('varchar', { name: 'externalId', nullable: true, length: 100 })
    externalId?: string;

    @Column('varchar', { name: 'fileType', nullable: true, length: 50 })
    fileType?: AppFileType;

    @Column('text', { name: 'externalFilePath', nullable: true })
    externalFilePath?: string;
    public toDto(): AppFileDto {
        return {
            id: this.id,
            mimeType: this.mimeType,
            name: this.name,
            physicalName: this.physicalName,
            size: this.size,
            externalId: this.externalId,
            fileType: this.fileType,
            externalFilePath: this.externalFilePath,
        };
    }

    public fromDto(dto: AppFileDto) {
        this.id = dto.id;
        this.mimeType = dto.mimeType;
        this.name = dto.name;
        this.physicalName = dto.physicalName;
        this.size = dto.size;
        this.fileType = dto.fileType;
        this.externalFilePath = dto.externalFilePath;
        this.externalId = dto.externalId;
        if (!this.id) this.id = undefined;
    }
}
