import { Repository } from 'typeorm';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { GetHistoriesResponse, GetHistoryResponse, HistoryDto } from './history.dto';
import { History } from './history.entity';
export declare class HistoriesService extends ApplicationBaseModelService<History, HistoryDto, GetHistoryResponse, GetHistoriesResponse> {
    private readonly repository;
    constructor(repository: Repository<History>);
}
