import { ApiClientHelpers } from './api-client.helpers';
import {
    BaseComponentSimple,
    ComponentWithDialogService,
    ComponentWithLoading,
} from './simple-types';

export class FrontCandidateHelpers {
    static async handleJobRefFromUrl(
        baseComponent: BaseComponentSimple,
        refFromUrl: string,
    ) {
        const refOk =
            !!refFromUrl && refFromUrl.length >= 2 && refFromUrl.length <= 12;

        if (!refOk) {
            return null;
        }

        const regex = /#{0,1}(\d{2,5})/;
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        const matchResult = refFromUrl.match(regex);

        if (matchResult && matchResult.length > 1 && matchResult[1]) {
            const jobOfferResponse = await baseComponent.sendApiRequest(
                ApiClientHelpers.jobOffersService.getJobOfferByRefLike({
                    ref: matchResult[1],
                }),
            );
            // console.log("Log ~ file: candidate-apply-form.component.ts:109 ~ CandidateApplyForm ~ init ~ jobOfferResponse:", jobOfferResponse);

            if (jobOfferResponse.jobOffer) {
                return jobOfferResponse.jobOffer;
            }
        }

        return null;
    }

    static async applyToJobOffers(
        baseComponent: BaseComponentSimple &
            ComponentWithLoading &
            ComponentWithDialogService,
        jobOfferIds: string[],
        showSnackBar = true,
    ) {
        {
            baseComponent.loading = true;
            const response = await baseComponent.sendApiRequest(
                ApiClientHelpers.candidateApplicationsService.applyToJobOffers({
                    applyToJobOffersRequest: { jobOfferIds: jobOfferIds },
                }),
            );
            baseComponent.loading = false;
            // if (!response.success) {
            //     baseComponent?.dialogService?.showDialog(response.message);
            //     return;
            // }
            if (baseComponent.handleErrorResponse(response)) {
                return false;
            }
            const msg = await ApiClientHelpers.translateService
                .get('CandidateApplication.CRMJobApplicationSent')
                .toPromise();

            if (showSnackBar) {
                baseComponent?.dialogService?.showSnackBar(msg);
            } else {
                baseComponent?.dialogService?.showDialog(msg);
            }

            return true;
        }
    }
}
