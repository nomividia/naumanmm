import { Directive } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AppPage } from '../../../../shared/shared-constants';
import { BaseComponent } from '../../components/base/base.component';
import { environment } from '../../environments/environment';
import { ServerResponseService } from '../../providers/server-response.service';
import { EventsHandler } from '../../services/events.handler';

export interface SeoData {
    title: string;
    meta?: { key: string; value: string }[];
    addSuffixToTitle?: boolean;
}

@Directive({})
export abstract class BasePageComponent extends BaseComponent {
    public static meta: Meta;
    public static title: Title;
    public static serverResponseService: ServerResponseService;
    public isAdmin: boolean;

    loading = false;

    constructor(
        public seoData?: SeoData,
        public unloadMessage?: string,
        public appPage?: AppPage,
    ) {
        super(unloadMessage);
        //TODO : SEO
        // ex : serverResponseService.setNotFound();
        this.isAdmin = this.GlobalAppService.userHasRole(
            this.AuthDataService.currentUser,
            this.RolesList.Admin,
        );
        this.setSeoData();

        if (appPage) {
            this.GlobalAppService.currentPage = appPage;
            EventsHandler.PageChanged.next();
        }
    }

    setSeoData(seoData?: SeoData) {
        if (!seoData) {
            seoData = this.seoData;
        }

        if (!seoData) {
            return;
        }

        if (typeof seoData.addSuffixToTitle === 'undefined') {
            seoData.addSuffixToTitle = true;
        }

        // TITLE & META
        if (seoData.title && BasePageComponent.title)
            BasePageComponent.title.setTitle(
                seoData.title +
                    (seoData.addSuffixToTitle
                        ? ' | ' + environment.appName
                        : ''),
            );
        if (seoData.meta && BasePageComponent.meta)
            seoData.meta.forEach((x) => {
                BasePageComponent.meta.addTag({
                    name: x.key,
                    content: x.value,
                });
            });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.GlobalAppService.currentPage = null;
    }

    public setNotFound() {
        if (!BasePageComponent.serverResponseService) {
            return;
        }

        BasePageComponent.serverResponseService.setNotFound();
    }
}
