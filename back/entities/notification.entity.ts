import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { NotificationDto } from '../models/dto/notification-dto';
import { AppBaseEntity } from './base-entity';
import { User } from './user.entity';

@Entity({ name: 'notifications' })
export class AppNotification extends AppBaseEntity {
    @ManyToOne(() => User, (user) => user.appNotifications, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    public user: User;

    @Column('varchar', { name: 'userId', length: 36, nullable: false })
    public userId: string;

    @Column('varchar', { name: 'title', nullable: false, length: 400 })
    public title: string;

    @Column('bool', { name: 'seen', nullable: false, default: 0 })
    public seen: boolean;

    @Column('text', { name: 'url', nullable: true })
    public url?: string;

    public toDto(): NotificationDto {
        return {
            id: this.id,
            creationDate: this.creationDate,
            seen: this.seen,
            title: this.title,
            userId: this.userId,
            url: this.url,
        };
    }

    fromDto(dto: NotificationDto) {}
}
