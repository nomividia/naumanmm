import { AnonymousMessageSenderType } from '../../../shared/shared-constants';
import { AppFile } from '../../entities/app-file.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { User } from '../../entities/user.entity';
import { CandidateApplication } from '../candidates-application/candidate-application.entity';
import { AnonymousExchangeDto } from './anonymous-exchange.dto';
export declare class AnonymousExchange extends AppBaseEntity {
    candidateApplicationId: string;
    candidateApplication: CandidateApplication;
    messageContent: string;
    consultantId?: string;
    consultant: User;
    seen: boolean;
    senderType: AnonymousMessageSenderType;
    fileId?: string;
    file?: AppFile;
    toDto(): AnonymousExchangeDto;
    fromDto(dto: AnonymousExchangeDto): void;
}
