import { FastifyReply } from 'fastify';
import { BaseController } from '../../shared/base.controller';
import { CandidateResumeService } from './candidate-resume.service';
import { GenerateCandidateResumeDto } from './candidate-resume-dto';
export declare class CandidateResumesController extends BaseController {
    private readonly candidateResumeService;
    constructor(candidateResumeService: CandidateResumeService);
    generateCandidateResume(candidateId: string, body: GenerateCandidateResumeDto, res: FastifyReply): Promise<never>;
}
