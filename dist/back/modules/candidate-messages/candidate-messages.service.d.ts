import { Repository } from 'typeorm';
import { GenericResponse } from '../../models/responses/generic-response';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { GetCandidatesForMessageResponse } from '../candidates/candidate-dto';
import { CandidateService } from '../candidates/candidates.service';
import { CandidateMessageDto, GetCandidateMessageResponse, GetCandidateMessagesResponse } from './candidate-message-dto';
import { CandidateMessage } from './candidate-message.entity';
export declare class CandidateMessagesService extends ApplicationBaseModelService<CandidateMessage, CandidateMessageDto, GetCandidateMessageResponse, GetCandidateMessagesResponse> {
    readonly repository: Repository<CandidateMessage>;
    private candidateService;
    constructor(repository: Repository<CandidateMessage>, candidateService: CandidateService);
    createOrUpdate(dto: CandidateMessageDto, ...toDtoParameters: any): Promise<GetCandidateMessageResponse>;
    getCandidateForMessaging(consultantSenderId: string): Promise<GetCandidatesForMessageResponse>;
    archiveOrRemoveAllCandidateMessage(candidateId: string, remove?: boolean): Promise<GenericResponse>;
}
