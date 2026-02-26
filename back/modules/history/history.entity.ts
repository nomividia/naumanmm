import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../entities/base-entity';
import { User } from '../../entities/user.entity';
import { HistoryDto } from './history.dto';

@Entity({ name: 'history' })
export class History extends AppBaseEntity {
    @Column('varchar', { name: 'entity', nullable: false, length: 255 })
    entity: string;

    @Column('varchar', { name: 'entityId', nullable: false, length: 36 })
    entityId: string;

    @Column('varchar', { name: 'field', nullable: false, length: 255 })
    field: string;

    @Column('datetime', { name: 'date', nullable: false })
    date: Date;

    @Column('text', { name: 'valueBefore', nullable: true })
    valueBefore?: string;

    @Column('text', { name: 'valueAfter', nullable: true })
    valueAfter?: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user?: User;

    @Column('varchar', { name: 'userId', nullable: true, length: 36 })
    userId: string;

    toDto(): HistoryDto {
        return {
            id: this.id,
            entity: this.entity,
            entityId: this.entityId,
            field: this.field,
            date: this.date,
            valueAfter: this.valueAfter,
            valueBefore: this.valueBefore,
            userId: this.userId,
            user: this.user ? this.user.toDto() : null,
        };
    }

    fromDto(dto: HistoryDto) {
        this.id = dto.id;
        this.entity = dto.entity;
        this.date = dto.date;
        this.field = dto.field;
        this.valueAfter = dto.valueAfter;
        this.valueBefore = dto.valueBefore;
        this.userId = dto.userId;
        this.entityId = dto.entityId;
    }
}
