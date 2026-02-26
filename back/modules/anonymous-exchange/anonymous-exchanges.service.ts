import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FastifyReply } from 'fastify';
import { FileHelpers } from 'nextalys-node-helpers';
import { Repository } from 'typeorm';
import { AppFile } from '../../entities/app-file.entity';
import { Environment } from '../../environment/environment';
import { AppErrorWithMessage } from '../../models/app-error';
import { AppFileDto } from '../../models/dto/app-file-dto';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { FileService } from '../../services/tools/file.service';
import { CandidateApplicationService } from '../candidates-application/candidate-applications.service';
import {
    AnonymousExchangeDto,
    GetAnonymousExchangeForCandidateApplicationResponse,
    GetAnonymousExchangesForCandidateApplicationResponse,
} from './anonymous-exchange.dto';
import { AnonymousExchange } from './anonymous-exchange.entity';

@Injectable()
export class AnonymousExchangesService extends ApplicationBaseModelService<
    AnonymousExchange,
    AnonymousExchangeDto,
    GetAnonymousExchangeForCandidateApplicationResponse,
    GetAnonymousExchangesForCandidateApplicationResponse
> {
    constructor(
        @InjectRepository(AnonymousExchange)
        public readonly repository: Repository<AnonymousExchange>,
        public candidateApplicationService: CandidateApplicationService,
        private fileService: FileService,
    ) {
        super();

        this.modelOptions = {
            getManyResponse:
                GetAnonymousExchangesForCandidateApplicationResponse,
            getOneResponse: GetAnonymousExchangeForCandidateApplicationResponse,
            getManyResponseField: 'exchanges',
            getOneResponseField: 'exchange',
            getManyRelations: ['consultant', 'candidateApplication', 'file'],
            getOneRelations: ['consultant', 'candidateApplication'],
            repository: this.repository,
            entity: AnonymousExchange,
            archiveField: 'archived',
            archiveFieldValue: true,
        };
    }

    async handleFileAndSaveExchange(
        anonymousExchangeDto: AnonymousExchangeDto,
        filesToHandle: { file: AppFileDto; name: string }[],
    ): Promise<GetAnonymousExchangeForCandidateApplicationResponse> {
        const response =
            new GetAnonymousExchangeForCandidateApplicationResponse();

        try {
            const exchange = new AnonymousExchange();
            exchange.fromDto(anonymousExchangeDto);
            exchange.file = new AppFile();
            const privateFolder = this.fileService.joinPaths(
                Environment.CandidateApplicationsDirectory,
                anonymousExchangeDto.id,
            );

            if (!(await FileHelpers.fileExists(privateFolder))) {
                await FileHelpers.createDirectory(privateFolder);
            }

            for (const fileWrapper of filesToHandle) {
                if (!fileWrapper.file) {
                    continue;
                }

                const filePath = this.fileService.joinPaths(
                    privateFolder,
                    fileWrapper.file.physicalName,
                );
                await this.fileService.moveFileDtoFromTemp(
                    fileWrapper.file,
                    filePath,
                );
                await FileHelpers.renameFile(
                    this.fileService.getTempFilePath(fileWrapper.file),
                    filePath,
                );

                exchange.file.fileType = fileWrapper.file.fileType;
                exchange.file.name = fileWrapper.file.name;
                exchange.file.physicalName = filePath;
                exchange.file.mimeType = fileWrapper.file.mimeType;
            }

            const saveResponse = await this.repository.save(exchange);
            response.exchange = saveResponse.toDto();
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async serveFile(res: FastifyReply, fileId: string, exchangeGuid: string) {
        try {
            const findApplicationWithExchangeGuid =
                await this.candidateApplicationService.findOne({
                    where: { guidExchange: exchangeGuid },
                    relations: [
                        'anonymousExchanges',
                        'anonymousExchanges.file',
                    ],
                });

            if (!findApplicationWithExchangeGuid.success) {
                throw new AppErrorWithMessage(
                    findApplicationWithExchangeGuid.message,
                );
            }

            const findFile =
                findApplicationWithExchangeGuid.candidateApplication.anonymousExchanges.find(
                    (x) => x.file?.id === fileId,
                )?.file;

            if (!findFile.id) {
                throw new AppErrorWithMessage('Unable to find file');
            }

            await this.setResponse(findFile, res, findFile.mimeType);
        } catch (error) {
            throw new AppErrorWithMessage(error);
        }
    }

    private async get(physicalName: string): Promise<Buffer> {
        return (await FileHelpers.readFile(physicalName, false)) as Buffer;
    }

    private async setResponse(
        file: AppFileDto,
        res: FastifyReply,
        contentType: string,
    ) {
        const data = await this.get(file.physicalName);

        if (data) {
            res.header('Content-Type', contentType);
            res.header(
                'Content-Disposition',
                `inline; filename="${file.name}"`,
            );
            res.status(HttpStatus.OK).send(data);
        } else {
            res.status(HttpStatus.NOT_FOUND).send('Fichier introuvable');
        }
    }
}
