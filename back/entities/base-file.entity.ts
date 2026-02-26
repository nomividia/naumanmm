import { Column } from 'typeorm';
import { AppBaseEntity } from './base-entity';

export class BaseFile extends AppBaseEntity {
    @Column('varchar', { name: 'name', nullable: false })
    name: string;

    @Column('int', { name: 'size', nullable: true })
    size?: number;

    @Column('varchar', { name: 'mime_type', nullable: false })
    mimeType: string;

    @Column('varchar', { name: 'physical_name', nullable: true })
    physicalName?: string;
}
