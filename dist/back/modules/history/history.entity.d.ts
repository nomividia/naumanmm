import { AppBaseEntity } from '../../entities/base-entity';
import { User } from '../../entities/user.entity';
import { HistoryDto } from './history.dto';
export declare class History extends AppBaseEntity {
    entity: string;
    entityId: string;
    field: string;
    date: Date;
    valueBefore?: string;
    valueAfter?: string;
    user?: User;
    userId: string;
    toDto(): HistoryDto;
    fromDto(dto: HistoryDto): void;
}
