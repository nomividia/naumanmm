import { Component, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { DateHelpers } from 'nextalys-js-helpers';
import { BaseMatTable } from '../../components/base/base-mat-table.component';
import { BaseRequest } from '../../components/base/base-types';
import { GenericError } from '../../environments/constants';
import {
    GenericResponse,
    GetJobsResponse,
    JobDto,
    JobsService,
} from '../../providers/api-client.generated';
import { GlobalAppService } from '../../services/global.service';
import { JobDetailsDialogComponent } from './job-details-dialog.component';
import { JobHelpers } from './job-helpers';

@Component({
    selector: 'app-jobs-list',
    templateUrl: './jobs-list.component.html',
    styleUrls: ['../../components/base/base-mat-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class JobsListComponent extends BaseMatTable<
    JobDto,
    BaseRequest,
    GetJobsResponse
> {
    nodeMainWorker = false;

    constructor(
        dialogService: DialogService,
        private jobsService: JobsService,
    ) {
        super('jobs', dialogService);
        this.setAutoVisibleColumns([
            {
                label: 'Nom',
                name: 'name',
                sortable: true,
            },
            // {
            //     label: 'Description',
            //     name: 'description',
            //     sortable: true,
            // },
            {
                label: 'Périodicité',
                name: 'cronPattern',
                displayFunction: (element) => {
                    return JobHelpers.getCronDesc(element);
                },
                sortable: true,
            },
            // {
            //     label: 'Service',
            //     name: 'applicationServiceName',
            //     sortable: true,
            // },
            // {
            //     label: 'Méthode',
            //     name: 'methodName',
            //     sortable: true,
            // },
            {
                label: 'Dernière execution',
                name: 'lastExecution',
                sortable: false,
                displayFunction: (element) => {
                    if (element.jobHistory && element.jobHistory.length > 0)
                        return (
                            DateHelpers.formatDate(
                                element.jobHistory[0].date,
                                true,
                            ) +
                            ' - ' +
                            (element.jobHistory[0].duration / 1000).toString() +
                            ' s'
                        );
                    return 'Jamais';
                },
            },
            {
                label: 'Statut',
                name: 'enabled',
                displayFunction: (element) => {
                    if (element.enabled)
                        return '<mat-icon class="mat-icon mat-icon-big material-icons" style="color:green;">check_circle_outline</mat-icon>';
                    else
                        return '<mat-icon class="mat-icon mat-icon-big material-icons" style="color:red;">cancel</mat-icon>';
                },
                sortable: true,
            },
        ]);
        this.setAdditionalVisibleColumns([
            { order: -1, name: 'items-selection' },
            { order: 20, name: 'actions' },
        ]);
        this.flushColumns();
    }

    public isExpandedAfterLoadingData(): boolean {
        return false;
    }

    public async loadCustomData(): Promise<GenericResponse> {
        const response = await this.sendApiRequest(
            this.jobsService.getAllJobs({
                start: this.request.start,
                length: this.request.length,
                orderby: this.request.orderby,
                order: this.request.order,
                search: this.request.search,
            }),
        );
        this.nodeMainWorker = response.isOnMainWorker;

        return response;
    }

    public removeCustomData(ids: string[]): Promise<GenericResponse> {
        return this.jobsService
            .deleteJobs({ jobIds: ids.join(';') })
            .toPromise();
    }

    async toggleJobState(job: JobDto) {
        if (job.enabled) {
            const dialogResult = await this.dialogService.showConfirmDialog(
                'Êtes-vous sûr de vouloir désactiver le job "' +
                    job.name +
                    '" ?',
            );
            if (!dialogResult.okClicked) {
                return;
            }
        }

        job.enabled = !job.enabled;
        this.loading = true;

        const response = await this.jobsService
            .createOrUpdateJob({ jobDto: job })
            .toPromise();

        this.loading = false;

        if (!response.success) {
            job.enabled = !job.enabled;
            this.dialogService.showDialog(response.message);
        }
        // if (!response.isOnMainWorker) {
        //     this.dialogService.showDialog('Modification enregistrées. Attention, cette opération n\'a pas été faite sur le thread principal.');
        // }
    }

    async triggerJob(job: JobDto) {
        const dialogResult = await this.dialogService.showConfirmDialog(
            'Êtes-vous sûr de vouloir déclencher le job "' + job.name + '" ?',
        );

        if (!dialogResult.okClicked) {
            return;
        }

        GlobalAppService.ShowMainLoadingOverlay('Éxécution du job...');

        const response = await this.jobsService
            .triggerJob({ id: job.id })
            .toPromise();

        GlobalAppService.HideMainLoadingOverlay();

        if (response && response.success) {
            this.loadData();
            this.dialogService.showDialog("Le job s'est exécuté correctement.");
        } else if (response) {
            this.dialogService.showDialog(response.message);
        } else {
            this.dialogService.showDialog(GenericError);
        }
    }

    openJobDetails(job: JobDto) {
        this.dialogService.showCustomDialog({
            component: JobDetailsDialogComponent,
            data: job,
        });
    }
}
