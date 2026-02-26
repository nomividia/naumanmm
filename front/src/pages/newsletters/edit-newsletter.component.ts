import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { Subject } from 'rxjs';
import { RefData } from '../../../../shared/ref-data';
import { RoutesList } from '../../../../shared/routes';
import {
    AppMainSender,
    AppPage,
    AppTypes,
    CandidateStatus,
    NewsletterLanguage,
    NewsletterState,
    NewsletterType,
} from '../../../../shared/shared-constants';
import { SharedService } from '../../../../shared/shared-service';
import {
    NewsletterTemplatesDialogComponent,
    NewsletterTemplatesDialogComponentResult,
} from '../../components/newsletter-templates-dialog/newsletter-templates-dialog.component';
import { GenericUnloadMessage } from '../../environments/constants';
import {
    AppValueDto,
    JobOfferDto,
    NewsletterDto,
    NewsletterService,
} from '../../providers/api-client.generated';
import { ReferentialProvider } from '../../providers/referential.provider';
import { BaseEditPageComponent } from '../base/base-edit-page.component';
import { NewsLetterPreviewDialogComponent } from './newsletter-preview-dialog.component';

interface JobOffersWrapper {
    checked: boolean;
    jobOffer: JobOfferDto;
}

@Component({
    selector: 'app-edit-newsletter',
    templateUrl: './edit-newsletter.component.html',
    styleUrls: [
        '../base/edit-page-style.scss',
        './edit-newsletter.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class EditNewsLetterComponent
    extends BaseEditPageComponent<NewsletterDto, NewsletterService>
    implements OnInit, OnDestroy
{
    selectedJobOffer: JobOfferDto;
    sendTooltip: string;
    noOffer: boolean;
    newsLetterCodeValues: AppValueDto[];
    selectedCandidateStatutList: string[];
    selectedJobIds: string[];
    cityFilter: string[] = [];
    countriesFilter: string[];

    candidateCountWilleReceiveNL: number = 0;
    jobOfferList: JobOffersWrapper[] = [];
    selectedJobOfferList: JobOfferDto[] = [];
    candidateStatusList: AppValueDto[] = [];
    isEditable = true;
    isNew = false;
    helpWording1 =
        'Tous les candidats identifiés comme parlant français ("langue parlée" dans la fiche candidat, "pays" dans la fiche candidature) recevront la version française de la newsletter.';
    helpWording2 =
        'Le filtre "Statut" est pris en compte uniquement pour la sélection des candidats enregistrés sur le CRM. Ce filtre n\'a aucun impact sur la sélection des candidatures.';

    // SenderSMSList = ['MMI'];
    SenderMailList = [AppMainSender];
    newsLetterCode = NewsletterState;
    CandidateStatus = CandidateStatus;
    NewsletterType = NewsletterType;
    isSenderDisabled = false;
    public NewsletterLanguage = NewsletterLanguage;
    RefData = RefData;
    countriesList = RefData.countriesListForCurrentLanguage;

    private cityInputSubject = new Subject<string>();
    private destroy$ = new Subject<void>();

    constructor(
        dialogService: DialogService,
        route: ActivatedRoute,
        router: Router,
        private newsLetterService: NewsletterService,
        private translate: TranslateService,
        private referentialService: ReferentialProvider,
    ) {
        super(
            dialogService,
            AppPage.NewsLetter,
            route,
            router,
            newsLetterService,
            'id',
            'newsletter',
            'newsletterDto',
            'getNewsletter',
            'createOrUpdateNewsletter',
            RoutesList.Newsletters,
            'id',
            null,
            GenericUnloadMessage,
        );
        this.loadRefData();
        this.setupCityDebounce();
    }

    private async loadRefData() {
        this.loading = true;

        const appTypes = await this.referentialService.getTypesValues(
            [AppTypes.NewsletterStateCode, AppTypes.CandidateStatusCode],
            true,
        );

        this.newsLetterCodeValues = appTypes.find(
            (x) => x.code === AppTypes.NewsletterStateCode,
        ).appValues;
        this.candidateStatusList = appTypes.find(
            (x) => x.code === AppTypes.CandidateStatusCode,
        ).appValues;
        this.loading = false;
    }

    // Set default values for the newsletter
    private setNewsletterData() {
        this.isNew = this.entityRefFieldValue === 'new';

        if (this.isNew) {
            this.isEditable = true;
            this.setDefaultSender();
            this.entity.language = NewsletterLanguage.FR;
            this.noOffer = false;
            this.entity.type = NewsletterType.Email;
        } else {
            this.isEditable = !(
                this.entity.newsletterStatus?.code ===
                    NewsletterState.Archived ||
                this.entity.newsletterStatus?.code === NewsletterState.Sent ||
                this.entity.newsletterStatus?.code ===
                    NewsletterState.Sent_SendInBlue ||
                this.entity.newsletterStatus?.code === NewsletterState.Pending
            );

            this.cityFilter = Array.isArray(this.entity.cityFilter)
                ? this.entity.cityFilter
                : [];
            this.countriesFilter =
                this.entity.countriesFilter?.split(',') || [];
            this.noOffer = !this.entity?.newslettersJobOffer?.length;

            // Set default sender for existing newsletters if not set
            if (!this.entity.sender) {
                this.setDefaultSender();
            }
        }
    }

    private setDefaultSender() {
        const currentUserEmail = this.AuthDataService.currentUser?.mail;

        if (
            currentUserEmail &&
            currentUserEmail === 'morgan@morganmallet.agency'
        ) {
            this.entity.sender = AppMainSender;
            this.isSenderDisabled = true;
        } else if (
            currentUserEmail &&
            currentUserEmail.endsWith('@morganmallet.agency')
        ) {
            // Use consultant's email if it's from morganmallet.agency domain
            this.entity.sender = currentUserEmail;
            this.isSenderDisabled = true;
            // Add consultant's email to the sender list if not already present
            if (!this.SenderMailList.includes(currentUserEmail)) {
                this.SenderMailList = [currentUserEmail, AppMainSender];
            }
        } else {
            // Use default sender for non-morganmallet.agency emails
            this.entity.sender = AppMainSender;
            this.isSenderDisabled = true;
        }
    }

    typeChanged() {
        if (this.entity.type === NewsletterType.SMS && !this.entity.sender) {
            this.entity.sender = 'MMI';
        }
    }

    async afterInitEditPageData() {
        this.setNewsletterData();
        console.log('this.entity', this.entity);
        this.selectedJobOfferList = [];

        if (this.entity.newslettersJobOffer) {
            for (const jobOffer of this.entity.newslettersJobOffer) {
                this.selectedJobOfferList.push(jobOffer.joboffer);
            }
        }

        this.setSelectedFilterFromEntity();

        if (!this.isNewsLetterPendingOrSentOrArchived()) {
            await this.getReceiversCount();
        }
        // console.log("🚀 ~ EditNewsLetterComponent ~ afterInitEditPageData ~ this.entity", this.entity);
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async afterSave() {
        this.setSelectedFilterFromEntity();

        return { success: true };
    }

    private setSelectedFilterFromEntity() {
        this.selectedJobIds = [];
        this.selectedCandidateStatutList = [];

        if (this.entity.newsLettersJob) {
            this.selectedJobIds = this.entity.newsLettersJob.map(
                (x) => x.jobTypeId,
            );
        }

        if (this.entity.newsLettersCandidateStatus) {
            this.selectedCandidateStatutList =
                this.entity.newsLettersCandidateStatus.map(
                    (x) => x.candidateStatusId,
                );
        }
    }

    onModifications() {
        this.hasPendingModifications = true;
    }

    beforeSaveCheck() {
        const errors: string[] = [];

        if (!this.entity?.title) {
            errors.push(this.translate.instant('Newsletter.FillTitle'));
        }

        if (!this.entity?.sender) {
            errors.push(this.translate.instant('Newsletter.FillSender'));
        }

        if (!this.entity?.subject || this.entity.subject.length > 190) {
            errors.push(this.translate.instant('Newsletter.Subject'));
        }

        this.entity.newslettersJobOffer = [];

        if (!errors?.length && this.selectedJobOfferList.length) {
            for (const selectedJobOffer of this.selectedJobOfferList) {
                const checkIfJobOfferNotAlreadyPush =
                    this.entity.newslettersJobOffer.find(
                        (x) => x.jobofferId === selectedJobOffer.id,
                    );

                if (checkIfJobOfferNotAlreadyPush?.id) {
                    continue;
                }

                this.entity.newslettersJobOffer.push({
                    jobofferId: selectedJobOffer.id,
                    newsletterId: this.entity.id,
                });
            }
            this.selectedJobOfferList = [];
        }

        // Ensure city filter is synchronized with entity before saving
        this.entity.cityFilter = this.cityFilter;

        return errors;
    }

    onSelectedJobOffer() {
        if (!this.selectedJobOffer) {
            return;
        }

        if (!this.selectedJobOfferList) {
            this.selectedJobOfferList = [];
        }

        const checkIfJobOfferNotAlreadyPush = this.selectedJobOfferList.find(
            (x) => x.id === this.selectedJobOffer.id,
        );

        if (checkIfJobOfferNotAlreadyPush?.id) {
            this.selectedJobOffer = null;

            return;
        }

        this.selectedJobOfferList.push(this.selectedJobOffer);
        this.selectedJobOffer = null;
    }

    onRemoveJobOfferInList(item: JobOfferDto) {
        if (!item) {
            return;
        }

        const index = this.selectedJobOfferList.findIndex(
            (x) => x.id === item.id,
        );

        if (index !== -1) {
            this.selectedJobOfferList.splice(index, 1);
        }
    }

    async archiveNewsletter() {
        if (this.isNew || !this.entity?.id) {
            return;
        }

        const dialogResult = await this.dialogService.showConfirmDialog(
            this.translate.instant('Global.ConfirmDelete'),
        );

        if (!dialogResult.okClicked) {
            return;
        }

        this.loading = true;

        const archiveNewsletterResponse = await this.sendApiRequest(
            this.newsLetterService.archiveNewsletter({ id: this.entity.id }),
        );

        this.loading = false;

        if (!archiveNewsletterResponse.success) {
            this.dialogService.showDialog(archiveNewsletterResponse.message);

            return;
        }

        this.entity = archiveNewsletterResponse.newsletter;
        this.isEditable = false;
        this.dialogService.showSnackBar(
            this.translate.instant('Newsletter.ArchiveSuccess'),
        );
        this.goBack();
    }

    async deleteNewsletter() {
        if (this.isNew || !this.entity?.id) {
            return;
        }

        const dialogResult = await this.dialogService.showConfirmDialog(
            this.translate.instant('Global.ConfirmDelete'),
        );

        if (!dialogResult.okClicked) {
            return;
        }

        this.loading = true;

        const response = await this.sendApiRequest(
            this.newsLetterService.deleteNewsletters({ ids: this.entity.id }),
        );

        this.loading = false;

        if (!response.success) {
            this.dialogService.showDialog(response.message);

            return;
        }

        this.isEditable = false;
        this.dialogService.showSnackBar(
            this.translate.instant('Newsletter.DeleteSuccess'),
        );
        this.goBack();
    }

    async duplicateNewsletter() {
        if (!this.entity.id || this.isNew) {
            return;
        }

        this.loading = true;

        const duplicateResponse = await this.newsLetterService
            .duplicateNewsletter({ id: this.entity.id })
            .toPromise();

        this.loading = false;

        if (!duplicateResponse.success) {
            this.dialogService.showDialog(duplicateResponse.message);

            return;
        }

        this.dialogService.showSnackBar(
            this.translate.instant('Newsletter.DuplicateSuccess'),
        );
        this.router.navigateByUrl(
            '/' +
                RoutesList.Newsletters +
                '/' +
                duplicateResponse.newsletter?.id,
        );
    }

    async sendNewsletters() {
        // if (this.entity.type === NewsletterType.SMS) {
        //     this.dialogService.showDialog('Bientôt disponible');
        //     return;
        // }
        if (this.entity.type !== NewsletterType.SMS) {
            this.loading = true;
            const previewResult = await this.previewNewsletter(true);
            this.loading = false;

            if (!previewResult) {
                return;
            }
        } else {
            this.loading = true;
            const saveOk = await this.save();
            this.loading = false;

            if (!saveOk) {
                return;
            }
        }
        // if (this.environment.production) {
        //     this.dialogService.showDialog('Bientôt disponible');
        //     return;
        // }
        const result = await this.dialogService.showConfirmDialog(
            this.translate.instant('Newsletter.SendNewsletterConfirm'),
        );

        if (!result.okClicked) {
            return;
        }

        this.loading = true;

        const sendResponse = await this.newsLetterService
            .sendNewsletter({ id: this.entity.id })
            .toPromise();

        this.loading = false;

        if (!sendResponse.success) {
            this.dialogService.showDialog(sendResponse.message);

            return;
        }

        this.dialogService.showSnackBar(
            this.translate.instant('Newsletter.SendSuccess'),
        );

        this.hasPendingModifications = false;
        this.goBack();
    }

    onCandidateStatusSelected() {
        if (!this.selectedCandidateStatutList) {
            return;
        }

        this.entity.newsLettersCandidateStatus = [];

        for (const id of this.selectedCandidateStatutList) {
            this.entity.newsLettersCandidateStatus.push({
                candidateStatusId: id,
                newsletterId: this.entity.id,
            });
        }

        this.getReceiversCount();
        // console.log("🚀 ~ EditNewsLetterComponent ~ onCandidateStatusSelected ~  this.entity.newsLettersCandidateStatus", this.entity.newsLettersCandidateStatus);
    }

    onJobSelected() {
        if (!this.selectedJobIds) {
            return;
        }

        this.entity.newsLettersJob = [];

        // console.log("🚀 ~ EditNewsLetterComponent ~ onCandidateJobStatusSelected ~ this.jobIds", this.jobIds);
        for (const jobId of this.selectedJobIds) {
            this.entity.newsLettersJob.push({
                jobTypeId: jobId,
                newsLetterId: this.entity.id,
            });
        }

        this.getReceiversCount();

        // console.log("🚀 ~ EditNewsLetterComponent ~ onCandidateJobStatusSelected ~  this.entity.newsLettersCandidateJob", this.entity.newsLettersJob);
    }

    onCandidateCitySelected() {
        // Update the entity with the current city filter
        this.entity.cityFilter = this.cityFilter;
        this.getReceiversCount();
    }

    onCandidateCountriesSelected() {
        this.entity.countriesFilter = this.countriesFilter?.join(',');
        this.getReceiversCount();
    }

    onDeleteCandidateCity() {
        this.cityFilter = [];
        this.entity.cityFilter = [];
        this.getReceiversCount();
    }

    isNewsLetterComplete() {
        if (
            !this.entity.title ||
            !this.entity.subject ||
            !this.entity.content ||
            !(this.selectedJobOfferList?.length || this.noOffer)
        ) {
            return false;
        }

        return true;
    }

    isNewsLetterReadyToSend() {
        if (this.entity.candidatesCount < 1) {
            this.sendTooltip = this.translate.instant('Newsletter.SendError');

            return false;
        }

        this.sendTooltip = this.translate.instant('Newsletter.Send');

        return true;
    }

    private async getCandidateCount() {
        this.loading = true;

        const getCountCandidateResponse = await this.sendApiRequest(
            this.newsLetterService.getNewsletterCandidates({
                jobIds: this.selectedJobIds?.length
                    ? this.selectedJobIds.join(',')
                    : null,
                statusIds: this.selectedCandidateStatutList?.length
                    ? this.selectedCandidateStatutList.join(',')
                    : null,
                cityFilter: this.cityFilter?.length ? this.cityFilter : null,
                countriesFilter: this.countriesFilter
                    ? this.countriesFilter.join(',')
                    : null,
                isNewsletterFrench:
                    this.entity.language === NewsletterLanguage.FR
                        ? 'true'
                        : 'false',
                newsletterType: this.entity.type,
            }),
        );

        this.loading = false;

        if (!getCountCandidateResponse.success) {
            this.dialogService.showDialog(getCountCandidateResponse.message);

            return;
        }

        this.entity.candidatesCount = getCountCandidateResponse.candidatesCount;
    }

    async getReceiversCount() {
        this.loading = true;

        await this.getCandidateCount();

        if (this.entity.includeCandidateApplications) {
            await this.getCandidateApplicationsCount();
        }

        this.loading = false;
    }

    private async getCandidateApplicationsCount() {
        this.loading = true;

        const getCountCandidateApplicationsResponse = await this.sendApiRequest(
            this.newsLetterService.getNewsletterCandidateApplications({
                newsletterType: this.entity.type,
                isNewsletterFrench:
                    this.entity.language === NewsletterLanguage.FR
                        ? 'true'
                        : 'false',
                jobIds: this.selectedJobIds?.length
                    ? this.selectedJobIds.join(',')
                    : null,
            }),
        );

        this.loading = false;

        if (!getCountCandidateApplicationsResponse.success) {
            this.dialogService.showDialog(
                getCountCandidateApplicationsResponse.message,
            );

            return;
        }

        this.entity.candidateApplicationsCount =
            getCountCandidateApplicationsResponse.candidateApplicationsCount;
    }

    private isNewsLetterPendingOrSentOrArchived() {
        if (this.isNew && !this.isEditable) {
            return false;
        }

        const passedNewsletterStatus: string[] = [
            NewsletterState.Pending,
            NewsletterState.Sent,
            NewsletterState.Archived,
            NewsletterState.Sent_SendInBlue,
        ];

        if (
            passedNewsletterStatus.indexOf(
                this.entity.newsletterStatus?.code,
            ) !== -1
        ) {
            return true;
        }

        return false;
    }

    onNoOfferChecked() {
        if (this.noOffer && this.selectedJobOfferList?.length) {
            this.selectedJobOfferList = [];
        }
    }

    async openNewsletterTemplatesDialog() {
        const dialogResult =
            await this.dialogService.showCustomDialogAwaitable<NewsletterTemplatesDialogComponentResult>(
                {
                    component: NewsletterTemplatesDialogComponent,
                    exitOnClickOutside: true,
                    width: '90%',
                    maxWidth: 800,
                },
            );

        if (!dialogResult?.newsletterTemplate) {
            return;
        }

        this.entity.content = dialogResult?.newsletterTemplate?.content;
        this.entity.title = dialogResult?.newsletterTemplate?.title;

        if (dialogResult?.newsletterTemplate?.subject) {
            this.entity.subject = dialogResult?.newsletterTemplate?.subject;
        }
    }

    async previewNewsletter(beforeSendMode: boolean) {
        this.loading = true;

        const saveOk = await this.save();

        this.loading = false;

        if (!saveOk) {
            return false;
        }

        return await this.dialogService.showCustomDialogAwaitable({
            component: NewsLetterPreviewDialogComponent,
            exitOnClickOutside: true,
            data: { id: this.entity.id, beforeSendMode: beforeSendMode },
        });
    }

    getSMSCountFromText(text: string) {
        return SharedService.getSMSCountFromText(text);
    }

    private setupCityDebounce() {
        // This will be handled by the chip component instead
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
