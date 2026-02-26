import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { KeyValueDto } from './key-value-dto';

@Entity({ name: 'key_values' })
export class KeyValue {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column('varchar', {
        name: 'key',
        nullable: false,
        length: 250,
        unique: true,
    })
    public key: string;

    @Column('text', { name: 'value', nullable: true })
    public value?: string;

    @Column('bool', { name: 'front-editable', nullable: false, default: true })
    public frontEditable: boolean;

    public toDto(): KeyValueDto {
        return {
            id: this.id,
            key: this.key,
            value: this.value,
            frontEditable: this.frontEditable,
        };
    }

    public fromDto(dto: KeyValueDto) {
        this.id = dto.id;
        this.key = dto.key;
        this.value = dto.value;
        this.frontEditable = dto.frontEditable;

        if (!this.id) {
            this.id = undefined;
        }
    }
}
