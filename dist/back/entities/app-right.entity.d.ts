import { AppRightDto } from '../models/dto/app-right-dto';
import { AppBaseEntity } from './base-entity';
import { UserRole } from './user-role.entity';
export declare class AppRight extends AppBaseEntity {
    code: string;
    label?: string;
    roles?: UserRole[];
    order?: number;
    toDto(getRoles: boolean): AppRightDto;
    fromDto(dto: AppRightDto): void;
}
