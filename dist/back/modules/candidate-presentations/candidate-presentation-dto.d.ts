import { BaseDto } from '../../models/dto/base.dto';
export declare class CandidatePresentationDto extends BaseDto {
    title: string;
    content?: string;
    candidateId: string;
    isDefault?: boolean;
    displayOrder?: number;
}
