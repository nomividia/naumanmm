import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { PushSubscriptionDto } from '../models/dto/push-subscription-dto';
import { User } from './user.entity';

@Entity({ name: 'user_push_subscriptions' })
export class AppPushSubscription {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @ManyToOne(() => User, (user) => user.pushSubscriptions, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    public user: User;

    @Column('varchar', { name: 'userId', length: 36, nullable: false })
    public userId: string;

    @Column('varchar', { name: 'endpoint', length: 400, nullable: false })
    public endpoint: string;
    // @Column('int', { name: 'expirationTime' })
    // public expirationTime: number;
    @Column('varchar', { name: 'options', length: 400, nullable: true })
    public options?: string;

    @Column('varchar', { name: 'auth', length: 255, nullable: false })
    public auth: string;
    @Column('varchar', { name: 'p256dh', length: 255, nullable: false })
    public p256dh: string;

    public toDto(): PushSubscriptionDto {
        return {
            userId: this.userId,
            endpoint: this.endpoint,
            //  expirationTime: this.expirationTime,
            keys: {
                auth: this.auth,
                p256dh: this.p256dh,
            },
            options: this.options ? JSON.parse(this.options) : '',
        };
    }
}
