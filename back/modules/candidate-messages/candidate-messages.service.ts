import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CandidateMessageSenderType } from '../../../shared/shared-constants';
import { AppErrorWithMessage } from '../../models/app-error';
import { GenericResponse } from '../../models/responses/generic-response';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { GetCandidatesForMessageResponse } from '../candidates/candidate-dto';
import { CandidateService } from '../candidates/candidates.service';
import {
    CandidateMessageDto,
    GetCandidateMessageResponse,
    GetCandidateMessagesResponse,
} from './candidate-message-dto';
import { CandidateMessage } from './candidate-message.entity';

@Injectable()
export class CandidateMessagesService extends ApplicationBaseModelService<
    CandidateMessage,
    CandidateMessageDto,
    GetCandidateMessageResponse,
    GetCandidateMessagesResponse
> {
    constructor(
        @InjectRepository(CandidateMessage)
        public readonly repository: Repository<CandidateMessage>,
        private candidateService: CandidateService,
    ) {
        super();

        this.modelOptions = {
            getManyResponse: GetCandidateMessagesResponse,
            getOneResponse: GetCandidateMessageResponse,
            getManyResponseField: 'candidateMessages',
            getOneResponseField: 'candidateMessage',
            getManyRelations: ['sender'],
            getOneRelations: ['sender', 'candidate'],
            repository: this.repository,
            entity: CandidateMessage,
            archiveField: 'archived',
            archiveFieldValue: true,
        };
    }

    public async createOrUpdate(
        dto: CandidateMessageDto,
        ...toDtoParameters: any
    ): Promise<GetCandidateMessageResponse> {
        const response = await super.createOrUpdate(dto, toDtoParameters);

        try {
            const candidate = await this.candidateService.repository.findOne({
                where: { id: dto.candidateId },
            });

            if (!candidate) {
                throw new AppErrorWithMessage('Error candidate');
            }

            candidate.lastCandidateMessageSendedDate =
                response.candidateMessage.creationDate;

            await this.candidateService.repository.save(candidate);
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    public async getCandidateForMessaging(
        consultantSenderId: string,
    ): Promise<GetCandidatesForMessageResponse> {
        const response = new GetCandidatesForMessageResponse();

        try {
            const getCandidateResponse = await this.candidateService.findAll(
                {
                    where: { lastCandidateMessageSendedDate: Not(IsNull()) },
                    order: { lastCandidateMessageSendedDate: 'DESC' },
                },
                false,
                [
                    'files',
                    'files.file',
                    'files.fileType',
                    'candidateCurrentJobs',
                    'candidateCurrentJobs.currentJob',
                    'candidateCurrentJobs.currentJob.translations',
                ],
            );
            const unseenCandidateMessages = await this.repository.find({
                where: { seen: false },
            });
            const consultantMessagesList = await this.repository.find({
                where: { senderId: consultantSenderId },
            });
            const messagesWithConsultant = await this.repository.find({
                where: { senderType: 'consultant' },
            });

            if (unseenCandidateMessages) {
                for (const candidate of getCandidateResponse.candidates) {
                    candidate.candidateMessagesUnseen =
                        unseenCandidateMessages.some(
                            (x) =>
                                x.candidateId === candidate.id &&
                                x.senderType ===
                                    CandidateMessageSenderType.Candidate,
                        );
                }
            }

            response.candidates = getCandidateResponse.candidates.filter(
                (x) =>
                    consultantMessagesList.find(
                        (y) => y.candidateId === x.id,
                    ) ||
                    !messagesWithConsultant.find((y) => y.candidateId === x.id),
            );
            response.unseenCandidateMessages = unseenCandidateMessages.filter(
                (x) => x.senderType === CandidateMessageSenderType.Candidate,
            ).length;

            response.success = true;
            // console.log("🚀 ~ CandidateMessagesService ~ getCandidateForMessaging ~ response", response);
        } catch (err) {
            throw new AppErrorWithMessage(err);
        }

        return response;
    }

    public async archiveOrRemoveAllCandidateMessage(
        candidateId: string,
        remove?: boolean,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            const candidateResponse = await this.candidateService.findOne({
                where: { id: candidateId },
            });
            const getCandidateAllMessages = await this.findAll({
                where: { candidateId: candidateId },
            });
            const messageIds = getCandidateAllMessages.candidateMessages.map(
                (x) => x.id,
            );

            if (remove) {
                this.delete(messageIds);
            } else {
                await this.archive(messageIds);
            }

            candidateResponse.candidate.lastCandidateMessageSendedDate = null;
            await this.candidateService.createOrUpdateWithoutRelations(
                candidateResponse.candidate,
            );

            response.success = true;
        } catch (err) {
            throw new AppErrorWithMessage(err);
        }

        return response;
    }
}
