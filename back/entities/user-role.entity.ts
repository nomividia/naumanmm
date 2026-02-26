import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRoleDto } from '../models/dto/user-role-dto';
import { AppRight } from './app-right.entity';
import { User } from './user.entity';

@Entity({ name: 'roles' })
export class UserRole {
    @PrimaryGeneratedColumn('increment', { name: 'id' })
    id: number;

    @Column('varchar', { name: 'role', length: 30, unique: true })
    role: string;

    @Column('varchar', { name: 'label', length: 150, nullable: true })
    label?: string;

    @Column('boolean', { name: 'enabled', nullable: false, default: 1 })
    enabled: boolean;

    @ManyToMany(() => User, (user) => user.roles)
    @JoinTable({ name: 'user_roles' })
    users?: User[];

    @ManyToMany(() => AppRight, (right) => right.roles, { cascade: true })
    @JoinTable({ name: 'roles_rights' })
    rights?: AppRight[];

    public toDto(): UserRoleDto {
        return {
            id: this.id,
            role: this.role,
            label: this.label,
            rights: this.rights
                ? this.rights.map((x) => x.toDto(false))
                : undefined,
            enabled: this.enabled,
        };
    }

    public fromDto(dto: UserRoleDto) {
        this.role = dto.role;
        this.id = dto.id;
        this.label = dto.label;
        this.enabled = dto.enabled;
        if (dto.rights) {
            this.rights = [];
            for (const rightDto of dto.rights) {
                const rightEntity = new AppRight();
                rightEntity.fromDto(rightDto);
                this.rights.push(rightEntity);
            }
        }
        if (!this.id) this.id = undefined;
    }
}
