import { Column, Entity, ManyToMany } from 'typeorm';
import { AppRightDto } from '../models/dto/app-right-dto';
import { AppBaseEntity } from './base-entity';
import { UserRole } from './user-role.entity';

@Entity({ name: 'app_rights' })
export class AppRight extends AppBaseEntity {
    @Column('varchar', {
        name: 'code',
        length: 60,
        unique: true,
        nullable: false,
    })
    code: string;

    @Column('varchar', {
        name: 'label',
        length: 200,
        unique: false,
        nullable: true,
    })
    label?: string;

    @ManyToMany(() => UserRole, (role) => role.rights)
    public roles?: UserRole[];

    @Column('float', { name: 'order', nullable: true })
    order?: number;
    public toDto(getRoles: boolean): AppRightDto {
        return {
            id: this.id,
            code: this.code,
            label: this.label,
            roles:
                this.roles && getRoles
                    ? this.roles.map((x) => x.toDto())
                    : undefined,
            order: this.order,
        };
    }

    public fromDto(dto: AppRightDto) {
        this.id = dto.id;
        this.code = dto.code;
        this.label = dto.label;
        this.order = dto.order;
        if (!this.id) this.id = undefined;
    }
}
