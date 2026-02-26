import { Repository } from 'typeorm';
import { GenericResponse } from '../../models/responses/generic-response';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { ReferentialService } from '../../services/referential.service';
import { MailService } from '../../services/tools/mail.service';
import { GetJobOfferResponse, GetJobOffersResponse, JobOfferDto, SendJobOfferByMailRequest } from './job-offer-dto';
import { JobOffer } from './job-offer.entity';
export declare class JobOfferService extends ApplicationBaseModelService<JobOffer, JobOfferDto, GetJobOfferResponse, GetJobOffersResponse> {
    readonly repository: Repository<JobOffer>;
    private mailService;
    private referentialService;
    constructor(repository: Repository<JobOffer>, mailService: MailService, referentialService: ReferentialService);
    createOrUpdate(dto: JobOfferDto, ...toDtoParameters: any): Promise<GetJobOfferResponse>;
    findAllExcludingPlaced(findOptions: any): Promise<GetJobOffersResponse>;
    scrapping(): Promise<GenericResponse>;
    sendJobOfferByMail(request: SendJobOfferByMailRequest, consultantEmail?: string): Promise<GenericResponse>;
}
