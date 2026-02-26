import { Directive, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'nextalys-angular-tools';
import { MainHelpers } from 'nextalys-js-helpers';
import { AppPage } from '../../../../shared/shared-constants';
import { GenericUnloadMessage } from '../../environments/constants';
import { GenericResponse } from '../../providers/api-client.generated';
import { BasePageComponent, SeoData } from './base-page.component';

@Directive({})
export abstract class BaseEditPageComponent<
    EntityType extends { id?: string | number },
    EntityService,
    GetResponse = any,
    SaveRequest = any,
> extends BasePageComponent {
    entityRefFieldValue: string;
    public entity: EntityType;
    additionalParametersForSave?: any;
    additionalParameters?: any;

    fieldsToDeleteBeforeSaveRequest: (keyof EntityType)[] = [];
    loading = false;
    public otherUserOnPageState = false;

    constructor(
        public dialogService: DialogService,
        appPage: AppPage,
        public route: ActivatedRoute,
        public router: Router,
        public entityApiService: EntityService,
        private urlArgId: string,
        public objectName: keyof GetResponse,
        public objectDtoName: keyof SaveRequest,
        private getOneApiMethodName: string,
        private saveApiMethodName: string,
        public baseRoute: string,
        private urlIdField?: keyof EntityType,
        seoData?: SeoData,
        unloadMessage?: string,
    ) {
        super(seoData, GenericUnloadMessage, appPage);

        if (unloadMessage) {
            this.unloadMessage = unloadMessage;
        }
    }

    ngOnInit(): void {
        this.initEditPage();
    }

    getSaveMethodName() {
        return this.saveApiMethodName;
    }

    private initEditPage() {
        const sub1 = this.route.params.subscribe(() => {
            this.reloadData();
        });

        this.eventsCollector.collect(sub1);
    }

    public async reloadData() {
        if (this.urlArgId) {
            this.entityRefFieldValue =
                this.route.snapshot.params[this.urlArgId];
        }

        if (this.entityRefFieldValue === 'new') {
            this.entity = {} as any;
        } else {
            let requestParam: any;

            this.loading = true;

            if (this.urlArgId) {
                requestParam = {};
                requestParam[this.urlArgId] = this.entityRefFieldValue;
            }

            if (this.additionalParameters) {
                if (!requestParam) {
                    requestParam = {};
                }

                Object.assign(requestParam, this.additionalParameters);
            }

            const response = (await (this.entityApiService as any)
                [this.getOneApiMethodName](requestParam)
                .toPromise()) as GenericResponse;
            this.loading = false;
            // console.log("Log: BaseEditPageComponent -> initEditPage -> response", response);

            if (response.success) {
                this.entity = (response as any)[this.objectName];
            } else if (response.message) {
                this.dialogService.showDialog(response.message);
            }
        }

        await this.afterInitEditPageData();
    }

    afterInitEditPageData(): any {
        //here to be overriden
    }

    afterSave(apiResponse: GenericResponse): Promise<GenericResponse> {
        // console.log('entity ::', this.entity);
        //here to be overriden
        return Promise.resolve({ success: true });
    }

    async save(exit?: boolean) {
        const errors: string[] = this.beforeSaveCheck();

        if (errors.length > 0) {
            this.dialogService.showDialog(
                'Liste des erreurs : <ul>' +
                    errors.map((x) => (x = '<li>' + x + '</li>')).join('') +
                    '</ul>',
            );

            return false;
        } else {
            let requestParam: any = {};

            this.loading = true;
            const entityClone = MainHelpers.cloneObject(this.entity);

            for (const fieldToDelete of this.fieldsToDeleteBeforeSaveRequest) {
                delete entityClone[fieldToDelete];
            }

            requestParam[this.objectDtoName] = entityClone;

            if (this.additionalParametersForSave) {
                if (!requestParam) {
                    requestParam = {};
                }

                Object.assign(requestParam, this.additionalParametersForSave);
            }

            this.GlobalAppService.toUtcDateRecursive(requestParam);

            const response = (await (this.entityApiService as any)
                [this.getSaveMethodName()](requestParam)
                .toPromise()) as GenericResponse;

            if (!response.success) {
                this.dialogService.showDialog(response.message);
            } else {
                if (response.success && (response as any)[this.objectName]) {
                    this.entity = (response as any)[this.objectName];
                    const afterSaveResponse = await this.afterSave(response);

                    if (!afterSaveResponse.success) {
                        //TODO ?
                    }

                    await this.afterInitEditPageData();
                }

                this.hasPendingModifications = false;

                if (exit) {
                    this.router.navigateByUrl('/' + this.baseRoute);
                } else if (!!this.urlArgId) {
                    if (!this.urlIdField) {
                        this.urlIdField = 'id';
                    }

                    this.router.navigateByUrl(
                        '/' +
                            this.baseRoute +
                            '/' +
                            ((this.entity as any)[this.urlIdField] as string),
                    );
                }
            }

            this.loading = false;

            return response.success;
        }
    }

    beforeSaveCheck(): string[] {
        return [];
    }

    goBack() {
        this.router.navigateByUrl('/' + this.baseRoute);
    }

    dataChanged() {
        this.hasPendingModifications = true;
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(e: KeyboardEvent) {
        let key: any;
        const possible = [e.key, (e as any).keyIdentifier, e.keyCode, e.which];

        while (key === undefined && possible.length > 0) {
            key = possible.pop();
        }

        if (
            key &&
            (key.toString() === '115' || key.toString() === '83') &&
            (e.ctrlKey || e.metaKey) &&
            !e.altKey
        ) {
            e.preventDefault();
            this.save();

            return false;
        }

        return true;
    }
}
