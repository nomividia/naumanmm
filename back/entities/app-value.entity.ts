import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AppValueDto } from '../models/dto/app-value-dto';
import { AppType } from './app-type.entity';
import { Translation } from './translation.entity';

@Entity({ name: 'app_values' })
export class AppValue {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column('varchar', { name: 'label', nullable: false })
    label: string;

    @Column('int', { name: 'order', nullable: true })
    order?: number;

    @Column('boolean', { name: 'enabled', nullable: false, default: 1 })
    enabled: boolean;

    @Column('varchar', {
        name: 'code',
        nullable: false,
        length: 100,
        unique: true,
    })
    code: string;

    @ManyToOne(() => AppType, (appType) => appType.appValues, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'appTypeId' })
    public appType?: AppType;

    @Column('varchar', { name: 'appTypeId', length: 36, nullable: false })
    public appTypeId: string;

    @OneToMany(() => Translation, (translation) => translation.appValue, {
        cascade: true,
    })
    public translations: Translation[];

    public toDto(): AppValueDto {
        return {
            id: this.id,
            label: this.label,
            order: this.order,
            code: this.code,
            appTypeId: this.appTypeId,
            enabled: this.enabled,
            appType: this.appType ? this.appType.toDto() : null,
            translations: this.translations
                ? this.translations.map((x) => x.toDto())
                : undefined,
        };
    }

    public fromDto(dto: AppValueDto) {
        this.label = dto.label;
        this.order = dto.order;
        this.appTypeId = dto.appTypeId;
        this.code = dto.code;
        this.id = dto.id;
        this.enabled = dto.enabled;

        if (dto.translations) {
            this.translations = [];
            dto.translations.forEach((translationDto) => {
                const translation = new Translation();
                translation.fromDto(translationDto);
                this.translations.push(translation);
            });
        }

        if (!this.id) this.id = undefined;
    }
}
