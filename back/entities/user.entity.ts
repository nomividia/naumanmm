import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { UserDto } from '../models/dto/user-dto';
import { Candidate } from '../modules/candidates/candidate.entity';
import { AppFile } from './app-file.entity';
import { AppLanguage } from './app-language.entity';
import { AppValue } from './app-value.entity';
import { AppBaseEntity } from './base-entity';
import { AppNotification } from './notification.entity';
import { AppPushSubscription } from './push-subscription.entity';
import { Translation } from './translation.entity';
import { UserRole } from './user-role.entity';

@Entity({ name: 'users' })
export class User extends AppBaseEntity {
    @Column('varchar', { name: 'username', length: 60, unique: true })
    userName: string;

    @Column('varchar', { name: 'firstName', length: 250, nullable: true })
    firstName: string;

    @Column('varchar', { name: 'lastName', length: 250, nullable: true })
    lastName: string;

    @Column('varchar', { name: 'facebookUserId', length: 100, nullable: true })
    facebookUserId?: string;

    @Column('varchar', { name: 'googleUserId', length: 100, nullable: true })
    googleUserId?: string;

    @Column('varchar', { name: 'password', length: 70, nullable: true })
    password: string;

    @Column('varchar', {
        name: 'mail',
        length: 255,
        nullable: true,
        unique: true,
    })
    mail?: string;

    @Column('varchar', { name: 'phone', length: 50, nullable: true })
    phone?: string;

    @Column('varchar', { name: 'phoneFix', length: 50, nullable: true })
    phoneFix: string;

    @ManyToMany(() => UserRole, (userRole) => userRole.users, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    public roles: UserRole[];

    @OneToMany(
        () => AppPushSubscription,
        (pushSubscription) => pushSubscription.user,
        { cascade: true, onUpdate: 'CASCADE' },
    )
    public pushSubscriptions: AppPushSubscription[];

    @OneToMany(
        () => AppNotification,
        (appNotification) => appNotification.user,
        { cascade: true, onUpdate: 'CASCADE' },
    )
    public appNotifications: AppNotification[];

    @ManyToOne(() => AppLanguage)
    @JoinColumn({ name: 'languageId' })
    public language?: AppLanguage;

    @Column('varchar', { name: 'languageId', length: 36, nullable: true })
    public languageId?: string;

    @Column('text', { name: 'presentation', nullable: true })
    presentation?: string;

    @OneToMany(() => Translation, (translation) => translation.user, {
        cascade: true,
        onUpdate: 'CASCADE',
    })
    public translations: Translation[];

    @ManyToOne(() => AppFile, { onDelete: 'SET NULL', cascade: true })
    @JoinColumn({ name: 'imageId' })
    public image?: AppFile;

    @Column('varchar', { name: 'imageId', length: 36, nullable: true })
    public imageId?: string;

    @Column('uuid', { name: 'recoverToken', nullable: true })
    recoverToken?: string;

    @Column('datetime', { name: 'recoverTokenExpirationDate', nullable: true })
    recoverTokenExpirationDate?: Date;

    @Column('varchar', { name: 'refreshToken', length: 36, nullable: true })
    refreshToken?: string;

    @OneToOne(() => Candidate, (candidate) => candidate.associatedUser, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    @Column('varchar', { name: 'candidateId', length: 36, nullable: true })
    candidateId?: string;

    @Column('varchar', { name: 'genderId', nullable: true, length: 36 })
    genderId: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'genderId' })
    gender?: AppValue;

    @Column('boolean', { name: 'TOSAccepted', nullable: true, default: false })
    TOSAccepted?: boolean;

    @OneToMany(() => Candidate, (candidates) => candidates.consultant)
    candidates?: Candidate[];

    @Column('varchar', { name: 'loginToken', length: 36, nullable: true })
    loginToken?: string;

    public toDto(getPassword: boolean = false): UserDto {
        return {
            id: this.id,
            userName: this.userName,
            mail: this.mail,
            disabled: this.disabled,
            presentation: this.presentation,
            password: getPassword ? this.password : undefined,
            pushSubscriptions: this.pushSubscriptions
                ? this.pushSubscriptions.map((x) => x.toDto())
                : [],
            roles: this.roles ? this.roles.map((x) => x.toDto()) : undefined,
            languageId: this.languageId,
            language: this.language ? this.language.toDto() : null,
            translations: this.translations
                ? this.translations.map((x) => x.toDto())
                : [],
            firstName: this.firstName,
            lastName: this.lastName,
            googleUserId: this.googleUserId,
            facebookUserId: this.facebookUserId,
            image: this.image ? this.image.toDto() : undefined,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            recoverToken: this.recoverToken,
            recoverTokenExpirationDate: this.recoverTokenExpirationDate,
            phone: this.phone,
            refreshToken: this.refreshToken,
            candidateId: this.candidateId,
            candidate: this.candidate ? this.candidate.toDto() : null,
            genderId: this.genderId,
            gender: this.gender?.toDto() ?? null,
            imageId: this.imageId,
            TOSAccepted: this.TOSAccepted,
            loginToken: this.loginToken,
        };
    }

    public fromDto(dto: UserDto) {
        this.userName = dto.userName;
        this.mail = dto.mail;
        this.id = dto.id;
        this.languageId = dto.languageId;
        this.presentation = dto.presentation;
        this.presentation = dto.presentation;
        this.firstName = dto.firstName;
        this.lastName = dto.lastName;
        this.googleUserId = dto.googleUserId;
        this.facebookUserId = dto.facebookUserId;
        this.imageId = dto.imageId;
        this.disabled = dto.disabled;
        this.recoverToken = dto.recoverToken;
        this.recoverTokenExpirationDate = dto.recoverTokenExpirationDate;
        this.phone = dto.phone;
        this.refreshToken = dto.refreshToken;
        this.candidateId = dto.candidateId;
        this.genderId = dto.genderId;
        this.TOSAccepted = dto.TOSAccepted;
        this.loginToken = dto.loginToken;

        if (dto.image) {
            const imageEntity = new AppFile();
            imageEntity.fromDto(dto.image);
            this.image = imageEntity;
            this.imageId = this.image.id;
        }
        if (dto.roles) {
            this.roles = dto.roles.map<UserRole>((xDto) => {
                const userRole = new UserRole();
                userRole.fromDto(xDto);
                return userRole;
            });
        }
        if (dto.translations) {
            this.translations = [];
            dto.translations.forEach((translationDto) => {
                const translation = new Translation();
                translation.fromDto(translationDto);
                //translation.userId = this.id;
                this.translations.push(translation);
            });
        }
        if (!this.id) this.id = undefined;
    }
}
