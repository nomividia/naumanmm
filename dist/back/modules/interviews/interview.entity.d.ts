import { MMIAgencyCode } from '../../../shared/interview-helpers';
import { InterviewConfirmationStatus } from '../../../shared/shared-constants';
import { AppBaseEntity } from '../../entities/base-entity';
import { User } from '../../entities/user.entity';
import { Candidate } from '../candidates/candidate.entity';
import { InterviewDto } from './interview-dto';
export declare class Interview extends AppBaseEntity {
    title: string;
    date: Date;
    comment?: string;
    candidateId: string;
    candidate: Candidate;
    consultantId: string;
    consultant: User;
    agencyPlace?: MMIAgencyCode;
    guid?: string;
    candidateResponse?: InterviewConfirmationStatus;
    noShow: boolean;
    toDto(): InterviewDto;
    fromDto(dto: InterviewDto): void;
}
