import { AppBaseEntity } from './base-entity';
export declare class BaseFile extends AppBaseEntity {
    name: string;
    size?: number;
    mimeType: string;
    physicalName?: string;
}
