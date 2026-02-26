import { GenericResponse } from '../../models/responses/generic-response';
import { AuthToolsService } from '../../services/auth-tools.service';
import { BaseController } from '../../shared/base.controller';
import { SocketGateway } from '../../sockets/socket-gateway';
import { GetCandidatesForMessageResponse, GetUnseenMessagesCountResponse } from '../candidates/candidate-dto';
import { CandidateMessageDto, GetCandidateMessageResponse, GetCandidateMessagesRequest, GetCandidateMessagesResponse, GetConsultantMessagesRequest } from './candidate-message-dto';
import { CandidateMessagesService } from './candidate-messages.service';
export declare class CandidateMessagesController extends BaseController {
    private readonly candidateMessagesService;
    private authToolsService;
    private socketGateway;
    constructor(candidateMessagesService: CandidateMessagesService, authToolsService: AuthToolsService, socketGateway: SocketGateway);
    getAll(request: GetCandidateMessagesRequest): Promise<GetCandidateMessagesResponse>;
    get(id: string): Promise<GetCandidateMessageResponse>;
    createOrUpdate(candidateMessageDto: CandidateMessageDto): Promise<GetCandidateMessageResponse>;
    delete(ids: string): Promise<GenericResponse>;
    archive(ids: string[]): Promise<GenericResponse>;
    getMyCandidateMessages(): Promise<GetCandidateMessagesResponse>;
    sendNewCandidateMessage(candidateMessageDto: CandidateMessageDto): Promise<GetCandidateMessageResponse>;
    setCandidatesMessagesToSeen(candidateId: string): Promise<GetUnseenMessagesCountResponse>;
    private p_setCandidatesMessagesToSeen;
    getCandidatesForMessaging(request: GetConsultantMessagesRequest): Promise<GetCandidatesForMessageResponse>;
    getUnSeenMessagesCount(): Promise<GetUnseenMessagesCountResponse>;
    archiveAllCandidateMessages(candidateId: string): Promise<GenericResponse>;
    deleteAllCandidateMessages(candidateId: string): Promise<GenericResponse>;
}
