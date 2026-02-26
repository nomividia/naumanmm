/* eslint-disable no-underscore-dangle */
import {
    Component,
    forwardRef,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { TranslateService } from '@ngx-translate/core';
import { NxsList } from 'nextalys-js-helpers/dist/nxs-list';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JobAppTypesListSorted } from '../../../../shared/shared-constants';
import { AppTypeDto, AppValueDto } from '../../providers/api-client.generated';
import { ReferentialProvider } from '../../providers/referential.provider';
import { BaseComponent } from '../base/base.component';

interface AppTypeWrapper extends AppTypeDto {
    expanded?: boolean;
    filteredCount?: number;
    totalCount?: number;
}

interface AppValueTranslated extends AppValueDto {
    translated?: string;
}

@Component({
    selector: 'app-jobs-selector',
    templateUrl: './jobs-selector.component.html',
    styleUrls: ['./jobs-selector.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => JobSelectorComponent),
            multi: true,
        },
    ],
})
export class JobSelectorComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    private innerValue: string | string[];

    jobsTypesList: AppTypeDto[] = [];
    filteredJobsCategoriesMultiLastValue: AppTypeWrapper[] = [];

    public jobsSearchFilter: FormControl = new FormControl();
    filteredJobsCategoriesMulti: ReplaySubject<AppTypeWrapper[]> =
        new ReplaySubject<AppTypeWrapper[]>(1);
    protected _onDestroy = new Subject<void>();

    @Input() fieldAppearance: MatFormFieldAppearance;
    @Input() multipleSelection: boolean;
    @Input() placeholder = '';
    @Input() disabled: boolean;
    @Input() required: boolean;
    @Input() longInput: boolean;

    constructor(
        private referentialService: ReferentialProvider,
        private translateService: TranslateService,
    ) {
        super();
        this.loadJobsTypesCategories();
    }

    groupClicked(group: AppTypeWrapper) {
        group.expanded = !group.expanded;
    }

    jobTypeSuffix(jobType: AppTypeWrapper) {
        const count: number = jobType.appValues?.length;

        if (!count) {
            return '';
        }

        if (!this.multipleSelection) {
            return '&nbsp;-&nbsp;(' + count + ')';
        }

        let selectedCount: number;

        if (this.multipleSelection) {
            selectedCount = jobType.appValues?.filter((x) =>
                (this.value as string[])?.includes(x.id),
            )?.length;
        } else {
            selectedCount = jobType.appValues?.filter(
                (x) => x.id === this.value,
            )?.length;
        }

        return (
            '&nbsp;-&nbsp;(' +
            (selectedCount ? selectedCount + '&nbsp;/&nbsp;' : '') +
            count +
            ')'
        );
    }

    ngOnInit() {
        this.jobsSearchFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterJobsCategoriesMulti();
            });

        // Subscribe to language changes and reload jobs data
        this.translateService.onLangChange
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.loadJobsTypesCategories();
            });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    private onChangeCallback: (_: any) => void = () => {};
    private onTouchedCallback: () => void = () => {};

    get value(): string | string[] {
        return this.innerValue;
    }

    set value(v: string | string[]) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    onBlur() {
        this.onTouchedCallback();
    }

    writeValue(value: string) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    private async loadJobsTypesCategories() {
        try {
            this.jobsTypesList = [];
            let getJobCategories =
                await this.referentialService.getTypesValuesJobs();

            if (!getJobCategories.length) {
                this.jobsTypesList = [];
            }

            getJobCategories = this.filterJobTypesList(getJobCategories);

            for (let i = 0; i <= getJobCategories.length; i++) {
                if (getJobCategories[i]) {
                    this.jobsTypesList.push({
                        translations: getJobCategories[i].translations,
                        label: getJobCategories[i].label,
                        appValues: getJobCategories[i].appValues,
                        code: getJobCategories[i].code,
                    });
                }
            }

            if (this.jobsTypesList && this.jobsTypesList?.length) {
                for (const item of this.jobsTypesList) {
                    if (!item.appValues?.length) {
                        continue;
                    }

                    for (const appValueItem of item.appValues) {
                        const casted = appValueItem as AppValueTranslated;
                        casted.translated =
                            this.GlobalAppService.dbTranslateAppValue(casted) ||
                            casted.label;
                    }

                    item.appValues = new NxsList(
                        item.appValues as AppValueTranslated[],
                    )
                        .OrderBy((x) => x.translated)
                        .ToArray();
                }
            }

            const typesArray: AppTypeWrapper[] = this.filterJobTypesList(
                this.jobsTypesList,
            ).slice();

            for (const typeItem of typesArray) {
                typeItem.expanded = false;
            }

            this.setNewListValue(typesArray);
        } catch (err) {}

        return;
    }

    matSelectClosed() {
        for (const item of this.filteredJobsCategoriesMultiLastValue) {
            item.expanded = false;
        }

        this.setNewListValue(this.filteredJobsCategoriesMultiLastValue);
    }

    private setNewListValue(array: AppTypeWrapper[]) {
        this.filteredJobsCategoriesMulti.next(array);
        this.filteredJobsCategoriesMultiLastValue = array;
    }

    protected filterJobsCategoriesMulti() {
        if (!this.jobsTypesList) {
            return;
        }

        let search: string = this.jobsSearchFilter.value;
        const jobsTypesListCopy = this.copyJobCategories(this.jobsTypesList);

        if (!search?.trim()) {
            this.setNewListValue(
                this.filterJobTypesList(this.jobsTypesList).slice(),
            );
            return;
        }

        search = search.toLowerCase();
        const filteredTypes = jobsTypesListCopy.filter((jobType) => {
            const showJobType =
                jobType.label.toLowerCase().indexOf(search) > -1;

            if (showJobType) {
                return true;
            }

            // Filter the appValues within each jobType
            jobType.appValues = jobType.appValues.filter((jobValue) => {
                const translated =
                    (jobValue as AppValueTranslated).translated ||
                    jobValue.label;
                return translated.toLowerCase().indexOf(search) > -1;
            });

            return jobType.appValues.length > 0;
        });

        this.setNewListValue(filteredTypes);
    }

    protected copyJobCategories(jobTypeCategories: AppTypeDto[]) {
        const jobCategoriesCopy: AppTypeDto[] = [];
        jobTypeCategories.forEach((jobTypeCategory) => {
            jobCategoriesCopy.push({
                label: jobTypeCategory.label,
                appValues: jobTypeCategory.appValues,
                code: jobTypeCategory.code,
                translations: jobTypeCategory.translations,
            });
        });

        return jobCategoriesCopy;
    }

    private filterJobTypesList(jobTypesList: AppTypeDto[]) {
        const arr: AppTypeDto[] = [];

        for (const appTypeCode of JobAppTypesListSorted) {
            arr.push(
                ...jobTypesList.filter(
                    (x) => x.code === appTypeCode && x.appValues?.length,
                ),
            );
        }

        return arr;
    }

    unselectAll() {
        this.value = [];
    }

    getSelectedItemsCount() {
        if (!this.value) {
            return 0;
        }

        if (!Array.isArray(this.value)) {
            return 0;
        }

        return this.value.length;
    }
}
