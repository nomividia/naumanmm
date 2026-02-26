import { GenericResponse } from '../../models/responses/generic-response';
import { AuthToolsService } from '../../services/auth-tools.service';
import { ReferentialService } from '../../services/referential.service';
import { BaseController } from '../../shared/base.controller';
import { GetJobOfferRequest, GetJobOfferResponse, GetJobOffersResponse, JobOfferDto, SendJobOfferByMailRequest } from './job-offer-dto';
import { JobOfferService } from './job-offers.service';
export declare class JobOfferController extends BaseController {
    private readonly jobOfferService;
    private referentialService;
    private authToolsService;
    constructor(jobOfferService: JobOfferService, referentialService: ReferentialService, authToolsService: AuthToolsService);
    getAll(request: GetJobOfferRequest): Promise<GetJobOffersResponse>;
    get(id: string): Promise<GetJobOfferResponse>;
    getJobOfferByRef(ref: string): Promise<GetJobOfferResponse>;
    getJobOfferByRefLike(ref: string): Promise<GetJobOfferResponse>;
    createOrUpdate(jobOfferDto: JobOfferDto): Promise<GetJobOfferResponse>;
    delete(ids: string): Promise<GenericResponse>;
    sendJobOfferByMail(request: SendJobOfferByMailRequest): Promise<GenericResponse>;
    redirectByRef(ref: string): Promise<{
        url: string;
    }>;
}
