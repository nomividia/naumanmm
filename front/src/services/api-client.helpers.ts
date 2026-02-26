import { TranslateService } from "@ngx-translate/core";
import { CandidateApplicationsService, JobOffersService } from "../providers/api-client.generated";

export class ApiClientHelpers {
    static jobOffersService: JobOffersService;
    static candidateApplicationsService: CandidateApplicationsService;
    static translateService: TranslateService;

    static init(jobOffersService: JobOffersService, candidateApplicationsService: CandidateApplicationsService, translateService: TranslateService) {
        this.jobOffersService = jobOffersService;
        this.candidateApplicationsService = candidateApplicationsService;
        this.translateService = translateService;
    }
}