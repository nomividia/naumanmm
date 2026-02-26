import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import {
    GetHistoriesResponse,
    GetHistoryResponse,
    HistoryDto,
} from './history.dto';
import { History } from './history.entity';

@Injectable()
export class HistoriesService extends ApplicationBaseModelService<
    History,
    HistoryDto,
    GetHistoryResponse,
    GetHistoriesResponse
> {
    constructor(
        @InjectRepository(History)
        private readonly repository: Repository<History>,
    ) {
        super();

        this.modelOptions = {
            getManyResponse: GetHistoriesResponse,
            getOneResponse: GetHistoryResponse,
            getManyResponseField: 'histories',
            getOneResponseField: 'history',
            getManyRelations: ['user'],
            getOneRelations: ['user'],
            repository: this.repository,
            entity: History,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }
}
