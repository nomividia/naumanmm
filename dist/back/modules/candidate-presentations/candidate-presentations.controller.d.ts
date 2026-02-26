import { CandidatePresentationDto } from './candidate-presentation-dto';
import { CandidatePresentationsService } from './candidate-presentations.service';
import { BaseController } from '../../shared/base.controller';
export declare class CandidatePresentationsController extends BaseController {
    private readonly candidatePresentationsService;
    constructor(candidatePresentationsService: CandidatePresentationsService);
    getDefaultPresentation(candidateId: string): Promise<CandidatePresentationDto | null>;
    findAllByCandidateId(candidateId: string): Promise<CandidatePresentationDto[]>;
    findOne(id: string): Promise<CandidatePresentationDto>;
    create(dto: CandidatePresentationDto): Promise<CandidatePresentationDto>;
    update(id: string, dto: CandidatePresentationDto): Promise<CandidatePresentationDto>;
    delete(id: string): Promise<void>;
    setAsDefault(id: string): Promise<CandidatePresentationDto>;
}
