import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { ImagesHelper } from '../../../../shared/images.helper';
import { RefData } from '../../../../shared/ref-data';
import { JobOfferState } from '../../../../shared/shared-constants';
import {
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
    selector: 'app-job-offer-list-minified',
    templateUrl: 'job-offer-list-minified.component.html',
    styleUrls: [
        '../../components/base/base-simple-list.component.scss',
        'job-offer-list-minified.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class JobOfferListMinifiedComponent extends BaseSimpleList<
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
    ) {
        super('jobOffers', dialogService, true);
    }

    public async loadCustomData(): Promise<GenericResponse> {
        this.request.order = 'desc';
        this.request.orderby = 'creationDate';

        return this.jobOfferService
            .getAllJobOffers({
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
}
