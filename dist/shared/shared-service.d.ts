export declare class SharedHelpers {
    static getYearListFromYear(fromYear?: number, nullExclude?: boolean): number[];
    static loadMonthListPassedFromYear(year: number): {
        label: string;
        value: number;
    }[];
}
declare type RolesStrOrRoleObj = {
    role?: string;
} | string;
interface SharedUserWrapper {
    roles?: RolesStrOrRoleObj[];
    rolesString?: string[];
}
declare type RoleFieldName = "roles" | "rolesString";
export declare class SharedService {
    static userHasRole(user: SharedUserWrapper, role: string, rolesFieldName?: RoleFieldName): boolean;
    static userHasOneOfRoles(user: SharedUserWrapper, roles: string[], rolesFieldName?: RoleFieldName): boolean;
    static userIsAdmin(user: SharedUserWrapper): boolean;
    static userIsAdminTech(user: SharedUserWrapper): boolean;
    static userIsRH(user: SharedUserWrapper): boolean;
    static userHasOneOfRights(user: SharedUserWrapper, fullRolesList: {
        role: string;
        rights?: {
            code: string;
        }[];
    }[], rights: string[], rolesFieldName?: string): boolean;
    static userHasRight(user: SharedUserWrapper, fullRolesList: {
        role: string;
        rights?: {
            code: string;
        }[];
    }[], right: string, rolesFieldName?: string): boolean;
    static generateAppValueCode(appValueDto: {
        appType: {
            code?: string;
        };
        label?: string;
    }): string;
    static userIsConsultant(user: {
        roles?: any[];
        rolesString?: string[];
    }): boolean;
    static userIsCandidate(user: {
        roles?: any[];
        rolesString?: string[];
    }): boolean;
    static getSMSCountFromText(text: string): number;
    static isValidEmail(email: string): boolean;
    static emailCanBeSent(email: string): boolean;
}
export declare class SharedCountryService {
    private static countriesWithoutCandidateDetailFields;
    static showCandidateDetailFieldsFromCountry(country: string): boolean;
    static showCandidateDetailFields(candidate: {
        addresses?: {
            country?: string;
        }[];
        address?: {
            country?: string;
        };
    }): boolean;
}
export {};
