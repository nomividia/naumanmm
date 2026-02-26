import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, IDialogResult } from 'nextalys-angular-tools';
import { RoutesList } from '../../../../shared/routes';
import { AppPage } from '../../../../shared/shared-constants';
import { GenericUnloadMessage } from '../../environments/constants';
import {
    CreateOrUpdateJobRequestParams,
    GetJobResponse,
    JobDto,
    JobsService,
} from '../../providers/api-client.generated';
import { BaseEditPageComponent } from '../base/base-edit-page.component';
import { JobHelpers } from './job-helpers';

@Component({
    selector: 'app-edit-job',
    templateUrl: './edit-job.component.html',
    styleUrls: ['../base/edit-page-style.scss', './edit-job.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class EditJobComponent extends BaseEditPageComponent<
    JobDto,
    JobsService,
    GetJobResponse,
    CreateOrUpdateJobRequestParams
> {
    additionalParameters = { includeJobHistory: 'true' };
    loading = false;

    constructor(
        route: ActivatedRoute,
        jobsService: JobsService,
        dialogService: DialogService,
        router: Router,
    ) {
        super(
            dialogService,
            AppPage.AdminEditJob,
            route,
            router,
            jobsService,
            'jobId',
            'job',
            'jobDto',
            'getJob',
            'createOrUpdateJob',
            RoutesList.AdminJobs,
            'id',
            null,
            GenericUnloadMessage,
        );
    }

    getCronDesc() {
        return JobHelpers.getCronDesc(this.entity);
    }

    async switchEnable() {
        let dialogResult: IDialogResult;

        if (this.entity.enabled) {
            dialogResult = await this.dialogService.showConfirmDialog(
                'Êtes-vous sûr de vouloir désactiver ce job ?',
            );
        } else {
            dialogResult = await this.dialogService.showConfirmDialog(
                'Êtes-vous sûr de vouloir activer ce job ?',
            );
        }

        if (!dialogResult.okClicked) {
            return;
        }

        this.entity.enabled = !this.entity.enabled;
        this.save();
    }

    // afterSave(response: GetJobResponse): Promise<GenericResponse> {
    //     if (!response.isOnMainWorker) {
    //         this.dialogService.showDialog('Modification enregistrées. Attention, cette opération n\'a pas été faite sur le thread principal.');
    //     }
    //     return Promise.resolve({ success: true });
    // }
}
