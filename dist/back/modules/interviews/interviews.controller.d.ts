import { GenericResponse } from '../../models/responses/generic-response';
import { AuthToolsService } from '../../services/auth-tools.service';
import { ReferentialService } from '../../services/referential.service';
import { MailService } from '../../services/tools/mail.service';
import { BaseController } from '../../shared/base.controller';
import { CandidateService } from '../candidates/candidates.service';
import { CheckCandidatesInterviewEligibilityRequest, CheckCandidatesInterviewEligibilityResponse, GetInterviewResponse, GetInterviewsRequest, GetInterviewsResponse, InterviewDto, SaveInterviewResponseResponse } from './interview-dto';
import { InterviewsService } from './interviews.service';
export declare class InterviewsController extends BaseController {
    private readonly interviewsService;
    private authToolsService;
    private mailService;
    private referentialService;
    private candidatesService;
    constructor(interviewsService: InterviewsService, authToolsService: AuthToolsService, mailService: MailService, referentialService: ReferentialService, candidatesService: CandidateService);
    getAll(request: GetInterviewsRequest): Promise<GetInterviewsResponse>;
    getMyInterviews(): Promise<GetInterviewsResponse>;
    get(id: string): Promise<GetInterviewResponse>;
    saveInterviewResponse(guid: string, response: string): Promise<SaveInterviewResponseResponse>;
    createOrUpdate(interviewDto: InterviewDto): Promise<GetInterviewResponse>;
    delete(ids: string): Promise<GenericResponse>;
    archive(ids: string[]): Promise<GenericResponse>;
    sendInterviewMailToCandidate(id: string): Promise<GenericResponse>;
    getConsultantInterviews(request: GetInterviewsRequest): Promise<GetInterviewsResponse>;
    sendPlacedCandidateReviewEmail(candidateId: string): Promise<GenericResponse>;
    checkCandidatesInterviewEligibility(request: CheckCandidatesInterviewEligibilityRequest): Promise<CheckCandidatesInterviewEligibilityResponse>;
}
