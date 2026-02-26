import { KeyValueDto } from './key-value-dto';
export declare class KeyValue {
    id: string;
    key: string;
    value?: string;
    frontEditable: boolean;
    toDto(): KeyValueDto;
    fromDto(dto: KeyValueDto): void;
}
