import { GenericResponse } from '../../models/responses/generic-response';
import { AuthToolsService } from '../../services/auth-tools.service';
import { ReferentialService } from '../../services/referential.service';
import { BaseController } from '../../shared/base.controller';
import { GetCandidatesCountRequest, GetCandidatesCountResponse, GetNewsletterCandidateApplicationsRequest, GetNewsletterCandidateApplicationsResponse, GetNewsletterResponse, GetNewslettersRequest, GetNewslettersResponse, NewsletterDto, UnsubscribeFromNewsletterRequest } from './newsletter.dto';
import { NewsletterService } from './newsletter.service';
export declare class NewsletterController extends BaseController {
    private newsletterService;
    private referentialService;
    private authToolsService;
    constructor(newsletterService: NewsletterService, referentialService: ReferentialService, authToolsService: AuthToolsService);
    previewNewsletter(id: string): Promise<GenericResponse>;
    get(id: string): Promise<GetNewsletterResponse>;
    getAll(request: GetNewslettersRequest): Promise<GetNewslettersResponse>;
    delete(ids: string): Promise<GenericResponse>;
    archive(id: string): Promise<GetNewsletterResponse>;
    createOrUpdate(newsletterDto: NewsletterDto): Promise<GetNewsletterResponse>;
    sendNewsletter(id: string): Promise<GenericResponse>;
    getNewsletterCandidates(request: GetCandidatesCountRequest): Promise<GetCandidatesCountResponse>;
    getNewsletterCandidateApplications(request: GetNewsletterCandidateApplicationsRequest): Promise<GetNewsletterCandidateApplicationsResponse>;
    duplicateNewsletter(id: string): Promise<GetNewsletterResponse>;
    unsubscribeFromNewsletter(request: UnsubscribeFromNewsletterRequest): Promise<GenericResponse>;
}
