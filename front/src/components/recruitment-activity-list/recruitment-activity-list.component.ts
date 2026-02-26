import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { ImagesHelper } from '../../../../shared/images.helper';
import { RefData } from '../../../../shared/ref-data';
import { JobOfferState } from '../../../../shared/shared-constants';
import {
    CandidateApplicationsService,
    GenericResponse,
    JobOfferDto,
    JobOffersService,
} from '../../providers/api-client.generated';
import { BaseSimpleList } from '../base/base-simple-list.component';
import { BaseRequest } from '../base/base-types';

export interface GetJobOffersRequest extends BaseRequest {
    jobIds?: string[];
    countryCode?: string[];
    consultantIds?: string[];
    status?: 'true' | 'false' | 'all';
    applyInCouple?: boolean;
    city?: string;
    contractTypeId?: string;
    filterByMobility?: boolean;
    contractTypeIds?: string[];
    stateId?: string;
}

@Component({
    selector: 'app-recruitment-activity-list',
    templateUrl: './recruitment-activity-list.component.html',
    styleUrls: [
        '../../components/base/base-simple-list.component.scss',
        'recruitment-activity-list.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class RecruitmentActivityListComponent extends BaseSimpleList<
    JobOfferDto,
    GetJobOffersRequest
> {
    ImagesHelper = ImagesHelper;
    RefData = RefData;
    JobOfferState = JobOfferState;

    @Input() request: GetJobOffersRequest;
    @Input() onClickGoToPublicLink = false;

    constructor(
        protected dialogService: DialogService,
        private jobOfferService: JobOffersService,
        private candidateApplicationsService: CandidateApplicationsService,
    ) {
        super('jobOffers', dialogService, true);
    }

    public async loadCustomData(): Promise<GenericResponse> {
        this.request.order = 'desc';
        this.request.orderby = 'creationDate';

        return await this.candidateApplicationsService
            .getAllRecruitmentActivities({
                length: this.request.length,
                order: this.request.order,
                orderby: this.request.orderby,
                search: this.request.search,
                start: this.request.start,
                jobIds: this.request.jobIds?.join(',') ?? undefined,
                countryCode: this.request.countryCode?.join(',') ?? undefined,
                consultantIds:
                    this.request.consultantIds?.join(',') ?? undefined,
                status:
                    this.request.stateId !== 'all'
                        ? this.request.stateId === 'archive'
                            ? 'false'
                            : 'true'
                        : undefined,
                applyInCouple: this.request.applyInCouple?.toString(),
                city: this.request.city,
                contractTypeId: this.request.contractTypeId,
                contractTypeIds:
                    this.request.contractTypeIds?.join(',') ?? undefined,
                stateId:
                    this.request.stateId !== 'all' &&
                    this.request.stateId !== 'archive'
                        ? this.request.stateId
                        : undefined,
            })
            .toPromise();
    }

    interviewedCount(jobOffer: JobOfferDto) {
        let count = 0;

        jobOffer.candidateApplications.forEach((data) => {
            if (data.candidate !== null) {
                count++;
            }
        });

        return count;
    }

    placedCount(jobOffer: JobOfferDto) {
        let count = 0;

        jobOffer.candidateApplications.forEach((data) => {
            if (
                data.applyStatus.id === 'd5b37bf7-4dda-4e1d-bcb2-54e0782dda33'
            ) {
                count++;
            }
        });

        return count;
    }
}
