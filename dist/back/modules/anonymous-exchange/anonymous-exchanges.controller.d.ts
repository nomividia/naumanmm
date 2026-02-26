import { FastifyReply } from 'fastify';
import { BaseController } from '../../shared/base.controller';
import { SocketGateway } from '../../sockets/socket-gateway';
import { AnonymousExchangeDto, GetAnonymousExchangeForCandidateApplicationRequest, GetAnonymousExchangeForCandidateApplicationResponse, GetAnonymousExchangesForCandidateApplicationResponse } from './anonymous-exchange.dto';
import { AnonymousExchangesService } from './anonymous-exchanges.service';
export declare class AnonymousExchangesController extends BaseController {
    private readonly anonymousExchangeService;
    private socketGateway;
    constructor(anonymousExchangeService: AnonymousExchangesService, socketGateway: SocketGateway);
    getAll(request: GetAnonymousExchangeForCandidateApplicationRequest): Promise<GetAnonymousExchangesForCandidateApplicationResponse>;
    createAnonymousExchange(anonymousExchangeDto: AnonymousExchangeDto): Promise<GetAnonymousExchangeForCandidateApplicationResponse>;
    getAnonymousExchangeFromApplicationId(candidateApplicationId: string): Promise<GetAnonymousExchangesForCandidateApplicationResponse>;
    sendNewCandidateMessage(anonymousExchangeDto: AnonymousExchangeDto): Promise<GetAnonymousExchangeForCandidateApplicationResponse>;
    servePdfFile(res: FastifyReply, fileId: string, exchangeGuid: string): Promise<void>;
}
