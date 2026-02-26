import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
    Component,
    OnInit,
    QueryList,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'nextalys-angular-tools';
import { NxsList } from 'nextalys-js-helpers/dist/nxs-list';
import { RoutesList } from '../../../../shared/routes';
import { AppPage } from '../../../../shared/shared-constants';
import { TranslationInputComponent } from '../../components/translations/translation-input.component';
import { GenericUnloadMessage } from '../../environments/constants';
import {
    AppTypeDto,
    AppValueDto,
    LanguageDto,
    ReferentialService,
} from '../../providers/api-client.generated';
import { ReferentialProvider } from '../../providers/referential.provider';
import { BaseEditPageComponent } from '../base/base-edit-page.component';

@Component({
    selector: 'app-edit-app-type',
    templateUrl: './edit-app-type.component.html',
    styleUrls: [
        '../base/edit-page-style.scss',
        './edit-app-type.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class EditAppTypeComponent
    extends BaseEditPageComponent<AppTypeDto, ReferentialService>
    implements OnInit
{
    additionalParameters = { includeDisabled: true };
    filteredAppValues: AppValueDto[] = [];

    @ViewChildren(TranslationInputComponent)
    translationsInputs: QueryList<TranslationInputComponent>;

    constructor(
        protected referentialService: ReferentialService,
        dialogService: DialogService,
        route: ActivatedRoute,
        router: Router,
        private referentialProvider: ReferentialProvider,
    ) {
        super(
            dialogService,
            AppPage.AdminAppTypes,
            route,
            router,
            referentialService,
            'id',
            'appType',
            'appTypeDto',
            'getOneAppType',
            'insertOrUpdateAppType',
            RoutesList.AdminAppTypes,
            'id',
            null,
            GenericUnloadMessage,
        );
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(
            this.filteredAppValues,
            event.previousIndex,
            event.currentIndex,
        );
        let index = 1;

        for (const appValue of this.filteredAppValues) {
            appValue.order = index;
            index++;
        }
    }

    afterInitEditPageData(): any {
        this.filteredAppValues =
            this.entity?.appValues?.filter((x) => x.enabled) || [];
    }

    afterSave() {
        this.referentialProvider.clearCache();

        return Promise.resolve({ success: true });
    }

    beforeSaveCheck(): string[] {
        const appValuesDisabled = this.entity.appValues.filter(
            (x) => !x.enabled,
        );

        this.entity.appValues = [...this.filteredAppValues];

        if (appValuesDisabled?.length) {
            this.entity.appValues = [
                ...this.entity.appValues,
                ...appValuesDisabled,
            ];
        }

        return [];
    }

    addNewAppValue() {
        let maxOrder = new NxsList(this.filteredAppValues)
            .Select((x) => x.order)
            .Max();

        if (!maxOrder || isNaN(maxOrder)) {
            maxOrder = 1;
        }

        const newAppValue: AppValueDto = {
            label: 'Nouvelle valeur',
            appTypeId: this.entity.id,
            enabled: true,
            order: maxOrder + 1,
            appType: undefined,
            code: '',
        };

        delete newAppValue.appType;
        this.filteredAppValues.push(newAppValue);
    }

    async archiveValue(appValue: AppValueDto) {
        const dialogResponse = await this.dialogService.showConfirmDialog(
            'Êtes-vous sûr de vouloir archiver cette valeur ?',
        );

        if (!dialogResponse.okClicked) {
            return;
        }

        appValue.enabled = false;
        this.loading = true;
        this.save();
        this.referentialProvider.clearCache();
    }

    async deleteValue(appValue: AppValueDto) {
        const dialogResponse = await this.dialogService.showConfirmDialog(
            'Êtes-vous sûr de vouloir supprimer cette valeur ?',
        );

        if (!dialogResponse.okClicked) {
            return;
        }

        this.loading = true;

        const response = await this.referentialService
            .deleteAppValues({
                multipleAppValuesRequest: { ids: [appValue.id] },
            })
            .toPromise();

        this.referentialProvider.clearCache();
        this.reloadData();
    }

    setAllTranslationInputs(language: LanguageDto) {
        if (!this.translationsInputs?.length) {
            return;
        }

        for (const translationsInput of this.translationsInputs) {
            translationsInput.languageToShow = language;
        }
    }
}
