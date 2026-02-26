import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import {
    AppTypeDto,
    AppValueDto,
    LanguageDto,
    TranslationDto,
    UserDto,
} from '../../providers/api-client.generated';
import { LanguageProvider } from '../../providers/language.provider';
import { BaseComponent } from '../base/base.component';
type TranslatableEntity = UserDto | AppValueDto | AppTypeDto;

@Component({
    selector: 'app-translation-input',
    templateUrl: './translation-input.component.html',
    styleUrls: ['./translation-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TranslationInputComponent extends BaseComponent implements OnInit {
    entity: TranslatableEntity;
    public languageDefault: LanguageDto;
    public languageToShow: LanguageDto;

    languages = LanguageProvider.languages;

    public ready = true;

    @Input() textarea: boolean = false;
    @Input() field: string;
    @Input() placeholder: string;
    @Input('entity')
    set setEntity(val: TranslatableEntity) {
        this.entity = val;
        this.setLanguagesOfTranslations();
    }

    @Output() onLanguageChange = new EventEmitter<LanguageDto>();

    constructor() {
        super();
    }
    private setLanguagesOfTranslations() {
        if (!this.languages) {
            return;
        }
        // if (LanguageProvider.currentLanguageCode) {
        //     this.languageDefault = this.languages?.find(l => l.code === LanguageProvider.currentLanguageCode);
        // }
        this.languageDefault = this.languages?.find((l) => l.code === 'fr');

        this.languageToShow = this.languageDefault;

        if (
            this.languageDefault &&
            (!this.entity.translations ||
                this.entity.translations.length <= 0 ||
                !this.entity.translations.some(
                    (x) => x.languageId === this.languageToShow.id,
                ))
        ) {
            this.addTranslation();
        }

        if (this.entity && this.entity.translations && this.languages) {
            this.entity.translations.forEach((t) => {
                if (t.languageId) {
                    t.language = this.languages.find(
                        (x) => x.id === t.languageId,
                    );
                }
            });
            // this.ready = true;
        }

        if (
            this.field &&
            this.languageToShow &&
            this.entity.translations &&
            this.entity.translations.length > 0
        ) {
            const translation =
                this.entity.translations.find(
                    (t) => t.languageId === this.languageToShow.id,
                ) || null;

            if (
                translation &&
                !translation.value &&
                (this.entity as any)[this.field]
            ) {
                translation.value = (this.entity as any)[this.field];
            }
        }
    }

    public get TranslationShow() {
        if (
            this.languageToShow &&
            this.entity.translations &&
            this.entity.translations.length > 0
        ) {
            return (
                this.entity.translations.find(
                    (t) => t.languageId === this.languageToShow.id,
                ) || null
            );
        }

        return null;
    }

    ngOnInit(): void {
        this.setLanguagesOfTranslations();
    }

    removeTranslation(translation: TranslationDto) {
        const index = this.entity.translations.findIndex(
            (x) => x === translation,
        );

        if (index > -1) {
            this.entity.translations.splice(index, 1);
            this.languageToShow = this.languageDefault;
        }
    }

    changeTransation(translationChanged: TranslationDto) {
        if (translationChanged.languageId === this.languageDefault.id) {
            (this.entity as any)[this.field] = translationChanged.value;
        }
    }

    addTranslation() {
        if (!this.entity.translations) {
            this.entity.translations = [];
        }

        let newTranslation = this.entity.translations.find(
            (t) => t.languageId === this.languageToShow.id,
        );

        if (!newTranslation) {
            newTranslation = {
                entityField: this.field,
                languageId: this.languageToShow ? this.languageToShow.id : null,
                language: this.languageToShow,
                value:
                    this.languageToShow &&
                    this.languageToShow.id === this.languageDefault.id
                        ? (this.entity as any)[this.field]
                        : '',
            };

            if (!newTranslation.value) {
                newTranslation.value = '';
            }

            this.entity.translations.push(newTranslation);
        }

        if (
            this.field &&
            !newTranslation.value &&
            (this.entity as any)[this.field]
        ) {
            newTranslation.value = (this.entity as any)[this.field];
        }

        this.onLanguageChange.emit(this.languageToShow);
    }
}
