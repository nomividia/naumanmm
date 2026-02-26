import { Repository } from 'typeorm';
import { CandidatePresentation } from '../../entities/candidate-presentation.entity';
import { CandidatePresentationDto } from './candidate-presentation-dto';
export declare class CandidatePresentationsService {
    private readonly candidatePresentationRepository;
    constructor(candidatePresentationRepository: Repository<CandidatePresentation>);
    findAllByCandidateId(candidateId: string): Promise<CandidatePresentationDto[]>;
    findOne(id: string): Promise<CandidatePresentationDto>;
    create(dto: CandidatePresentationDto): Promise<CandidatePresentationDto>;
    update(id: string, dto: CandidatePresentationDto): Promise<CandidatePresentationDto>;
    delete(id: string): Promise<void>;
    setAsDefault(id: string): Promise<CandidatePresentationDto>;
    getDefaultPresentation(candidateId: string): Promise<CandidatePresentationDto | null>;
}
