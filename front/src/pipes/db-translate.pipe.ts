import { Pipe, PipeTransform } from '@angular/core';
import {
    AppTypeDto,
    AppValueDto,
    UserDto,
} from '../providers/api-client.generated';
import { LanguageProvider } from '../providers/language.provider';

@Pipe({ name: 'dbTranslate', pure: false })
export class DbTranslatePipe implements PipeTransform {
    constructor() {}

    static dbTranslateValue(
        field: string,
        entity: UserDto | AppValueDto | AppTypeDto,
    ) {
        let value = '';

        if (entity?.translations && LanguageProvider.currentLanguage?.id) {
            const translation = entity.translations.find(
                (x) =>
                    x.entityField === field &&
                    x.languageId === LanguageProvider.currentLanguage.id,
            );
            if (translation) {
                value = translation.value;
            }
        }

        if (!value && entity) {
            value = (entity as any)[field];
        }

        return value;
    }

    //change entity parameter  => UserDto | EventDto | ...
    transform(
        field: string,
        entity: UserDto | AppValueDto | AppTypeDto,
    ): string {
        return DbTranslatePipe.dbTranslateValue(field, entity);
    }
}
