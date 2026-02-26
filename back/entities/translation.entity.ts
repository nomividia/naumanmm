import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TranslationDto } from '../models/dto/translation-dto';
import { AppLanguage } from './app-language.entity';
import { AppType } from './app-type.entity';
import { AppValue } from './app-value.entity';
import { User } from './user.entity';

@Entity({ name: 'translations' })
export class Translation {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column('varchar', { name: 'entityField', length: 50, nullable: false })
    public entityField: string;

    @ManyToOne(() => AppLanguage)
    @JoinColumn({ name: 'languageId' })
    public language: AppLanguage;

    @Column('varchar', { name: 'languageId', length: 36, nullable: false })
    public languageId: string;

    @Column('text', { name: 'value', nullable: false })
    public value: string;

    //Entities
    @ManyToOne(() => User, (user) => user.translations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    public user: User;

    @Column('varchar', { name: 'userId', length: 36, nullable: true })
    public userId: string;

    @ManyToOne(() => AppValue, (appValue) => appValue.translations, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'appValueId' })
    public appValue?: AppValue;

    @Column('varchar', { name: 'appValueId', length: 36, nullable: true })
    public appValueId?: string;

    @ManyToOne(() => AppType, (appType) => appType.translations, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'appTypeId' })
    public appType?: AppType;

    @Column('varchar', { name: 'appTypeId', length: 36, nullable: true })
    public appTypeId?: string;

    public toDto(): TranslationDto {
        return {
            id: this.id,
            userId: this.userId,
            entityField: this.entityField,
            value: this.value,
            languageId: this.languageId,
            language: this.language ? this.language.toDto() : null,
            //entities
            appValueId: this.appValueId,
            appTypeId: this.appTypeId,
            // appValue: null,
            // user: null,
            //user: this.user ? this.user.toDto() : null,
        };
    }

    public fromDto(dto: TranslationDto) {
        this.id = dto.id;
        this.entityField = dto.entityField;
        this.value = dto.value;
        this.languageId = dto.languageId;
        this.userId = dto.userId;
        this.appValueId = dto.appValueId;
        this.appTypeId = dto.appTypeId;

        if (!this.id) this.id = undefined;

        if (!this.appTypeId) delete this.appTypeId;

        if (!this.appValueId) delete this.appValueId;
    }
}
