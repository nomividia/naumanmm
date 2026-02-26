import { GenericResponse } from '../../models/responses/generic-response';
import { BaseController } from '../../shared/base.controller';
import { HistoriesService } from './histories.service';
import { GetHistoriesResponse, GetHistoryRequest, GetHistoryResponse, HistoryDto } from './history.dto';
export declare class HistoriesController extends BaseController {
    private historiesService;
    constructor(historiesService: HistoriesService);
    getAll(request: GetHistoryRequest): Promise<GetHistoriesResponse>;
    get(id: string): Promise<GetHistoryResponse>;
    createOrUpdate(history: HistoryDto): Promise<GetHistoryResponse>;
    delete(ids: string): Promise<GenericResponse>;
}
