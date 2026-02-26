import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LanguageDto } from '../models/dto/language-dto';

@Entity({ name: 'app_languages' })
export class AppLanguage {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column('varchar', {
        name: 'code',
        nullable: false,
        length: 40,
        unique: true,
    })
    code: string;

    @Column('text', { name: 'label', nullable: false })
    label: string;

    @Column('text', { name: 'icon', nullable: false })
    icon: string;

    public toDto(): LanguageDto {
        return {
            id: this.id,
            label: this.label,
            code: this.code,
            icon: this.icon,
        };
    }

    public fromDto(dto: LanguageDto) {
        this.code = dto.code;
        this.label = dto.label;
        this.icon = dto.icon;
        this.id = dto.id;
        if (!this.id) this.id = undefined;
    }
}
