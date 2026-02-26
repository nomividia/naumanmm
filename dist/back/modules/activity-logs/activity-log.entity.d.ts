import { AppValue } from '../../entities/app-value.entity';
import { User } from '../../entities/user.entity';
import { ActivityLogDto } from './activity-log-dto';
export declare class ActivityLog {
    id: string;
    user?: User;
    userId: string;
    type?: AppValue;
    typeId: string;
    date: Date;
    meta?: string;
    toDto(): ActivityLogDto;
    fromDto(dto: ActivityLogDto): void;
}
