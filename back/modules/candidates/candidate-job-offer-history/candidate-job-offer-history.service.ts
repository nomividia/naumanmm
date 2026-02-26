import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationBaseModelService } from '../../../services/base-model.service';
import {
    CandidateJobOfferHistoryDto,
    GetCandidateJobOfferHistoryRequest,
} from './candidate-job-offer-history-dto';
import {
    CandidateJobOfferAction,
    CandidateJobOfferHistory,
} from './candidate-job-offer-history.entity';

@Injectable()
export class CandidateJobOfferHistoryService extends ApplicationBaseModelService<
    CandidateJobOfferHistory,
    CandidateJobOfferHistoryDto,
    any,
    any
> {
    constructor(
        @InjectRepository(CandidateJobOfferHistory)
        public readonly repository: Repository<CandidateJobOfferHistory>,
    ) {
        super();
    }

    async createHistoryEntry(
        candidateId: string,
        jobOfferId: string,
        action: CandidateJobOfferAction,
        candidateFirstName: string,
        candidateLastName: string,
        startDate?: Date,
        contractFileId?: string,
    ): Promise<CandidateJobOfferHistoryDto> {
        const historyEntry = new CandidateJobOfferHistory();
        historyEntry.candidateId = candidateId;
        historyEntry.jobOfferId = jobOfferId;
        historyEntry.action = action;
        historyEntry.candidateFirstName = candidateFirstName;
        historyEntry.candidateLastName = candidateLastName;
        historyEntry.actionDate = new Date();
        historyEntry.startDate = startDate;
        historyEntry.contractFileId = contractFileId;

        const savedEntry = await this.repository.save(historyEntry);
        return savedEntry.toDto();
    }

    async getJobOfferHistory(
        request: GetCandidateJobOfferHistoryRequest,
    ): Promise<{
        success: boolean;
        message?: string;
        history?: CandidateJobOfferHistoryDto[];
        totalCount?: number;
    }> {
        try {
            const queryBuilder = this.repository
                .createQueryBuilder('history')
                .leftJoinAndSelect('history.candidate', 'candidate')
                .leftJoinAndSelect('history.jobOffer', 'jobOffer')
                .leftJoinAndSelect('jobOffer.customer', 'customer')
                .leftJoinAndSelect('history.contractFile', 'contractFile')
                .leftJoinAndSelect('contractFile.file', 'contractFileAppFile');

            if (request.jobOfferId) {
                queryBuilder.where('history.jobOfferId = :jobOfferId', {
                    jobOfferId: request.jobOfferId,
                });
            }

            if (request.candidateId) {
                queryBuilder.andWhere('history.candidateId = :candidateId', {
                    candidateId: request.candidateId,
                });
            }

            // Order by action date descending (most recent first)
            queryBuilder.orderBy('history.actionDate', 'DESC');

            if (request.start !== undefined && request.length !== undefined) {
                queryBuilder.skip(request.start).take(request.length);
            }

            const [history, totalCount] = await queryBuilder.getManyAndCount();

            return {
                success: true,
                history: history.map((entry) => entry.toDto()),
                totalCount,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async getCandidateHistory(candidateId: string): Promise<{
        success: boolean;
        message?: string;
        history?: CandidateJobOfferHistoryDto[];
    }> {
        return this.getJobOfferHistory({ candidateId });
    }
}
