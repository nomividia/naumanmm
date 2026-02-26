import {
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export class AppBaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @CreateDateColumn({
        name: 'creationDate',
        nullable: false,
        type: 'datetime',
    })
    creationDate: Date;

    @UpdateDateColumn({ name: 'modifDate', nullable: false, type: 'datetime' })
    modifDate: Date;

    @Column('boolean', { name: 'disabled', nullable: false, default: 0 })
    disabled: boolean;
}
