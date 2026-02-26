import { Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { DateHelpers } from 'nextalys-js-helpers';
import { ImagesHelper } from '../../../../shared/images.helper';
import { InterviewConfirmationStatus } from '../../../../shared/shared-constants';
import { BaseSimpleList } from '../../components/base/base-simple-list.component';
import { BaseRequest } from '../../components/base/base-types';
import { DetailInterviewDialogComponent } from '../../components/detail-interview-dialog/detail-interview-dialog.component';
import {
    GetInterviewsResponse,
    InterviewDto,
    InterviewsService,
} from '../../providers/api-client.generated';

export interface DetailInterviewDialogData {
    interview: InterviewDto;
    candidateId?: string;
    defaultConsultantId?: string;
    readOnly?: boolean;
}

interface InterviewRequest extends BaseRequest {
    interviewCurrentDate?: 'past' | 'coming';
    interviewFilterMonth?: string;
    interviewFilterYear?: string;
    interviewConfirmationStatus?: InterviewConfirmationStatus;
    noShow?: boolean;
}

interface MonthWrapper {
    label: string;
    code: number;
}

@Component({
    selector: 'app-consultant-interview',
    templateUrl: './consultant-interviews.component.html',
    styleUrls: ['../../components/base/base-simple-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ConsultantInterviewsComponent),
            multi: true,
        },
    ],
})
export class ConsultantInterviewsComponent extends BaseSimpleList<
    InterviewDto,
    InterviewRequest
> {
    candidateInterviews: InterviewDto[] = [];
    yearList: number[] = [];
    monthList: MonthWrapper[] = [];

    ImageHelper = ImagesHelper;
    InterviewConfirmationStatus = InterviewConfirmationStatus;

    constructor(
        private interviewsService: InterviewsService,

        public dialogService: DialogService,
        public translate: TranslateService,
    ) {
        super('interviews', dialogService, true);
        this.createYearAndMonthRange();
    }

    async loadCustomData(): Promise<GetInterviewsResponse> {
        this.loading = true;
        const monthFilter =
            this.request.interviewFilterMonth != null
                ? this.request.interviewFilterMonth.toString()
                : null;
        const yearFilter =
            this.request.interviewFilterYear != null
                ? this.request.interviewFilterYear.toString()
                : null;

        const getConsultantInterviewsResponse = await this.sendApiRequest(
            this.interviewsService.getConsultantInterviews({
                interviewFilterMonth: monthFilter ?? undefined,
                interviewFilterYear: yearFilter ?? undefined,
                interviewCurrentDate:
                    this.request.interviewCurrentDate ?? undefined,
                interviewConfirmationStatus:
                    this.request.interviewConfirmationStatus,
                noShow: this.request.noShow ?? undefined,
                order: 'desc',
                orderby: 'date',
                length: this.request.length,
                // search: this.request.search,
                start: this.request.start,
            }),
        );
        this.loading = false;

        if (getConsultantInterviewsResponse.success) {
            this.candidateInterviews =
                getConsultantInterviewsResponse.interviews;
        }

        return getConsultantInterviewsResponse;
    }

    createYearAndMonthRange() {
        const currentYear = new Date().getFullYear();
        this.yearList.push(currentYear);

        for (let i = 2010; i < currentYear; i++) {
            this.yearList.push(i);
        }

        this.yearList.sort((a, b) => b - a);

        for (let y = 0; y < 12; y++) {
            this.monthList.push({
                label: DateHelpers.GetMonthName(y, 'fr'),
                code: y + 1,
            });
        }

        this.monthList.sort((a, b) => a.code - b.code);
    }

    getInterviewLabel(interview: InterviewDto) {
        const today = new Date();

        if (today.getTime() < interview.date.getTime()) {
            return this.translate.instant('Global.InComing');
        }

        return this.translate.instant('Global.Past');
    }

    async openDetailInterviewDialog(interview: InterviewDto) {
        const data: DetailInterviewDialogData = {
            interview,
            candidateId: interview.candidate?.id,
            defaultConsultantId: interview.consultant?.id ?? null,
        };

        const reload = await this.dialogService.showCustomDialogAwaitable({
            component: DetailInterviewDialogComponent,
            data,
            exitOnClickOutside: true,
            width: '90%',
            maxWidth: 1000,
        });

        if (reload) {
            this.loadCustomData();
        }
    }

    onAddInterview() {
        const interview: InterviewDto = {};
        this.openDetailInterviewDialog(interview);
    }
}
