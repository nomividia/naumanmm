import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CacheManager } from '../../../shared/cache-manager';
import {
    AppTypes,
    JobAppTypesListSorted,
} from '../../../shared/shared-constants';
import { ArchiveFakeAppValueCode } from '../environments/constants';
import { environment } from '../environments/environment';
import { AuthDataService } from '../services/auth-data.service';
import { FrontCacheManager } from '../services/front-cache-manager';
import {
    AppTypeDto,
    AppValueDto,
    KeyValueService,
    ReferentialService,
    UserRoleDto,
    UsersRolesService,
} from './api-client.generated';
import { LocalStorageService } from './local-storage.service';

type AppCacheKey = 'appTypes' | 'keyValues' | 'usersRoles';
const appTypesKey: AppCacheKey = 'appTypes';
const appTypesExpirationTime = 6; //hours
const keyValuesKey: AppCacheKey = 'keyValues';
const keyValuesExpirationTime = 6; //hours
const userRolesKey: AppCacheKey = 'usersRoles';
const userRolesExpirationTime = 6; //hours

@Injectable()
export class ReferentialProvider {
    constructor(
        private referentialService: ReferentialService,
        private keyValueService: KeyValueService,
        private usersRolesService: UsersRolesService,
        private translateService: TranslateService,
    ) {
        FrontCacheManager.init();
    }

    public async getTypeValues(
        typeCode: string,
        includeTranslations?: boolean,
    ): Promise<AppValueDto[]> {
        const types = await this.getTypesValues(
            [typeCode],
            includeTranslations,
        );
        if (!types || types.length === 0) {
            return [];
        }

        return types[0].appValues;
    }

    public async getTypesValuesJobs(otherTypes?: (AppTypes | string)[]) {
        const types: string[] = [...JobAppTypesListSorted];

        if (otherTypes?.length) {
            types.push(...otherTypes);
        }

        return await this.getTypesValues(types, true);
    }

    public async getTypesValues(
        typeCodes: string[],
        includeTranslations?: boolean,
    ) {
        return await CacheManager.getDataFromCache<AppTypeDto>(
            typeCodes,
            appTypesKey,
            'code',
            (keysToLoad: string[]) =>
                this.referentialService
                    .getMultipleTypeValues({
                        start: 0,
                        length: 1000,
                        appTypesCodes: keysToLoad.join(','),
                        includeTranslations: includeTranslations
                            ? 'true'
                            : 'false',
                    })
                    .toPromise(),
            'appTypes',
            environment.version,
            appTypesExpirationTime,
        );
    }

    public async getKeyValue(keys: string[]) {
        return await CacheManager.getDataFromCache<AppTypeDto>(
            keys,
            keyValuesKey,
            'key',
            (keysToLoad: string[]) =>
                this.keyValueService
                    .getKeyValues({
                        start: 0,
                        length: 1000,
                        keys: keysToLoad.join(','),
                    })
                    .toPromise(),
            'keyValues',
            environment.version,
            keyValuesExpirationTime,
        );
    }

    public async getRoles(clearCache: boolean = false) {
        if (clearCache) {
            LocalStorageService.removeFromLocalStorage(userRolesKey);
        }

        if (!AuthDataService.currentUser) {
            return [];
        }

        return await CacheManager.getDataFromCache<UserRoleDto>(
            null,
            userRolesKey,
            'role',
            () =>
                this.usersRolesService
                    .getUserRoles({
                        start: 0,
                        length: 1000,
                        includeRights: 'true',
                    })
                    .toPromise(),
            'userRoles',
            environment.version,
            userRolesExpirationTime,
        );
    }

    clearCache(keys?: AppCacheKey[]) {
        if (!keys?.length) {
            keys = ['appTypes', 'keyValues', 'usersRoles'];
        }

        for (const key of keys) {
            LocalStorageService.removeFromLocalStorage(key);
        }
    }

    async addArchivedFakeAppValue(appValuesList: AppValueDto[]) {
        if (!appValuesList?.length) {
            appValuesList = [];
        }

        const label = await this.translateService.get('Archived').toPromise();
        appValuesList.push({
            label: label,
            id: ArchiveFakeAppValueCode,
            code: ArchiveFakeAppValueCode,
            appTypeId: undefined,
            appType: undefined,
            enabled: true,
        });
    }
}
