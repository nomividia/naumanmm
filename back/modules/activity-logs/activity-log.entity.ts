import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AppValue } from '../../entities/app-value.entity';
import { User } from '../../entities/user.entity';
import { ActivityLogDto } from './activity-log-dto';

@Entity({ name: 'activity_logs' })
export class ActivityLog {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    public user?: User;

    @Column('varchar', { name: 'userId', length: 36, nullable: false })
    public userId: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'typeId' })
    public type?: AppValue;

    @Column('varchar', { name: 'typeId', length: 36, nullable: false })
    public typeId: string;

    @Column('datetime', { name: 'date', nullable: false })
    date: Date;

    @Column('text', { name: 'meta', nullable: true })
    public meta?: string;

    public toDto(): ActivityLogDto {
        return {
            id: this.id,
            date: this.date,
            typeId: this.typeId,
            userId: this.userId,
            user: this.user ? this.user.toDto() : undefined,
            type: this.type ? this.type.toDto() : undefined,
            meta: this.meta,
        };
    }

    public fromDto(dto: ActivityLogDto) {
        this.id = dto.id;
        this.date = dto.date;
        this.typeId = dto.typeId;
        this.userId = dto.userId;
        this.meta = dto.meta;
        if (!this.id) this.id = undefined;
    }
}
