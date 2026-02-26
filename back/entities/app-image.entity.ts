import { Column, Entity } from 'typeorm';
import { AppImageDto } from '../models/dto/app-image-dto';
import { BaseFile } from './base-file.entity';

@Entity({ name: 'app_images' })
export class AppImage extends BaseFile {
    @Column('float', { name: 'width', nullable: false })
    public width: number;

    @Column('float', { name: 'height', nullable: false })
    public height: number;

    public toDto(): AppImageDto {
        return {
            id: this.id,
            mimeType: this.mimeType,
            name: this.name,
            physicalName: this.physicalName,
            size: this.size,
            height: this.height,
            width: this.width,
        };
    }

    public fromDto(dto: AppImageDto) {
        this.id = dto.id;
        this.mimeType = dto.mimeType;
        this.name = dto.name;
        this.physicalName = dto.physicalName;
        this.size = dto.size;
        this.height = dto.height;
        this.width = dto.width;
        if (!this.id) this.id = undefined;
    }
}
