import { FastifyReply } from 'fastify';
import { Repository } from 'typeorm';
import { AppFileDto } from '../../models/dto/app-file-dto';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { FileService } from '../../services/tools/file.service';
import { CandidateApplicationService } from '../candidates-application/candidate-applications.service';
import { AnonymousExchangeDto, GetAnonymousExchangeForCandidateApplicationResponse, GetAnonymousExchangesForCandidateApplicationResponse } from './anonymous-exchange.dto';
import { AnonymousExchange } from './anonymous-exchange.entity';
export declare class AnonymousExchangesService extends ApplicationBaseModelService<AnonymousExchange, AnonymousExchangeDto, GetAnonymousExchangeForCandidateApplicationResponse, GetAnonymousExchangesForCandidateApplicationResponse> {
    readonly repository: Repository<AnonymousExchange>;
    candidateApplicationService: CandidateApplicationService;
    private fileService;
    constructor(repository: Repository<AnonymousExchange>, candidateApplicationService: CandidateApplicationService, fileService: FileService);
    handleFileAndSaveExchange(anonymousExchangeDto: AnonymousExchangeDto, filesToHandle: {
        file: AppFileDto;
        name: string;
    }[]): Promise<GetAnonymousExchangeForCandidateApplicationResponse>;
    serveFile(res: FastifyReply, fileId: string, exchangeGuid: string): Promise<void>;
    private get;
    private setResponse;
}
