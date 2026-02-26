import { UserRoleDto } from '../models/dto/user-role-dto';
import { AppRight } from './app-right.entity';
import { User } from './user.entity';
export declare class UserRole {
    id: number;
    role: string;
    label?: string;
    enabled: boolean;
    users?: User[];
    rights?: AppRight[];
    toDto(): UserRoleDto;
    fromDto(dto: UserRoleDto): void;
}
