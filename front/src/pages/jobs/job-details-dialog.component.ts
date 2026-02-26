import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '../../components/base/base.component';
import { JobDto, JobsService } from '../../providers/api-client.generated';

@Component({
    selector: 'app-job-details-dialog',
    templateUrl: './job-details-dialog.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [
        `
            app-job-details-dialog table {
                border-collapse: collapse;
            }
            app-job-details-dialog table,
            app-job-details-dialog td,
            app-job-details-dialog th {
                border: 1px solid black;
            }
            app-job-details-dialog td,
            app-job-details-dialog th {
                padding: 4px;
            }
        `,
    ],
})
export class JobDetailsDialogComponent extends BaseComponent {
    loading = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public job: JobDto,
        private jobsService: JobsService,
    ) {
        super();
        this.loadJobDetails();
    }

    async loadJobDetails() {
        this.loading = true;

        const jobResponse = await this.jobsService
            .getJob({ jobId: this.job.id, includeJobHistory: 'true' })
            .toPromise();

        this.loading = false;

        if (jobResponse.success) {
            this.job = jobResponse.job;
            this.job.jobHistory.sort(
                (a, b) => b.date.getTime() - a.date.getTime(),
            );
        }
    }
}
