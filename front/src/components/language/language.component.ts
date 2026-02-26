import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { MainHelpers } from 'nextalys-js-helpers';
import { IntlLanguage, RefData } from '../../../../shared/ref-data';
import {
    AppValueDto,
    CandidateLanguageDto,
} from '../../providers/api-client.generated';
import { BaseComponent } from '../base/base.component';

@Component({
    selector: 'app-language',
    templateUrl: './language.component.html',
    styleUrls: [
        './language.component.scss',
        '../../pages/base/edit-page-style.scss',
        '../candidate-informations/candidate-informations.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class LanguageComponent extends BaseComponent implements AfterViewInit {
    newLanguage: IntlLanguage;
    newLevelLanguage: AppValueDto;

    RefData = RefData;

    loading = false;
    tempLanguagesList: IntlLanguage[] = [];

    @Input() partnerLanguages: boolean;
    @Input() candidateLanguages: CandidateLanguageDto[];
    @Input() isEditMode: boolean;
    @Input() languagesList: IntlLanguage[];
    @Input() levelLanguageList: AppValueDto[];

    @Output() onSave = new EventEmitter<CandidateLanguageDto[]>();
    @Output() onModification = new EventEmitter<boolean>();

    constructor(private dialogService: DialogService) {
        super();
    }

    ngAfterViewInit() {
        this.tempLanguagesList = MainHelpers.cloneObject(this.languagesList);
    }

    removeLanguage(item: CandidateLanguageDto) {
        const index = this.candidateLanguages.indexOf(item);

        if (index !== -1) {
            this.candidateLanguages.splice(index, 1);
        }
        // this.reloadLanguages();
        this.emitModification();
    }

    // private reloadLanguages() {
    //     if (!this.tempLanguagesList?.length)
    //         this.tempLanguagesList = [];
    //     this.tempLanguagesList = this.languagesList.filter(x => !this.candidateLanguages?.some(y => y.languageCode === x.code));
    // }

    addCandidateLanguage() {
        if (!this.candidateLanguages) {
            this.candidateLanguages = [];
        }

        this.candidateLanguages.push({
            languageCode: null,
            levelLanguageId: null,
            isPartnerLanguage: this.partnerLanguages,
        });

        this.emitModification();
    }

    checkLanguageBeforeAdd(language: CandidateLanguageDto) {
        if (language.levelLanguageId) {
            language.levelLanguage = this.levelLanguageList.find(
                (x) => x.id === language.levelLanguageId,
            );
        }

        if (this.candidateLanguages?.length) {
            const sameLanguagesCount = this.candidateLanguages.filter(
                (x) => x.languageCode === language.languageCode,
            ).length;

            if (sameLanguagesCount > 1) {
                this.candidateLanguages.splice(
                    this.candidateLanguages.lastIndexOf(language),
                    1,
                );
                this.dialogService.showDialog(
                    'Cette langue fait déjà parti de vos langues',
                );

                return;
            }
        }

        this.emitModification();
    }

    emitModification() {
        this.hasPendingModifications = true;
        this.onModification.emit(this.hasPendingModifications);
    }
}
