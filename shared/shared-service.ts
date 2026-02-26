import { DateHelpers, MainHelpers } from "nextalys-js-helpers";
import { RolesList } from "./shared-constants";

export class SharedHelpers {
    public static getYearListFromYear(
        fromYear?: number,
        nullExclude?: boolean
    ) {
        if (!fromYear) {
            fromYear = 2018;
        }

        const yearList: number[] = [];

        if (!nullExclude) {
            yearList.push(null);
        }

        const currentYear = new Date().getFullYear();

        for (let i = fromYear; i <= currentYear; i++) {
            yearList.push(i);
        }

        yearList.sort((a, b) => b - a);

        return yearList;
    }

    public static loadMonthListPassedFromYear(
        year: number
    ): { label: string; value: number }[] {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const monthList: { label: string; value: number }[] = [];

        monthList.push({ label: "Tous", value: null });

        for (let i = 0; i <= 11; i++) {
            if (year === currentYear && i > currentMonth) {
                continue;
            }

            monthList.push({
                label: DateHelpers.GetMonthName(i),
                value: i + 1,
            });
        }

        return monthList;
    }
}

type RolesStrOrRoleObj = { role?: string } | string;
interface SharedUserWrapper {
    roles?: RolesStrOrRoleObj[];
    rolesString?: string[];
}

type RoleFieldName = "roles" | "rolesString";

export class SharedService {
    public static userHasRole(
        user: SharedUserWrapper,
        role: string,
        rolesFieldName: RoleFieldName = null
    ): boolean {
        return this.userHasOneOfRoles(user, [role], rolesFieldName);
    }

    public static userHasOneOfRoles(
        user: SharedUserWrapper,
        roles: string[],
        rolesFieldName: RoleFieldName = null
    ): boolean {
        if (!user) {
            return false;
        }

        if (!rolesFieldName) {
            rolesFieldName =
                user.roles && !!user.roles.length ? "roles" : "rolesString";
        }

        return (
            user &&
            user[rolesFieldName] &&
            user[rolesFieldName].some((x: RolesStrOrRoleObj) => {
                if (typeof x === "string") {
                    return roles.indexOf(x) !== -1;
                } else if (!!x?.role) {
                    return roles.some((y) => x.role === y);
                }

                return false;
            })
        );
    }

    public static userIsAdmin(user: SharedUserWrapper): boolean {
        return this.userHasRole(user, RolesList.Admin);
    }

    public static userIsAdminTech(user: SharedUserWrapper): boolean {
        return this.userHasRole(user, RolesList.AdminTech);
    }

    public static userIsRH(user: SharedUserWrapper): boolean {
        return this.userHasRole(user, RolesList.RH);
    }

    public static userHasOneOfRights(
        user: SharedUserWrapper,
        fullRolesList: { role: string; rights?: { code: string }[] }[],
        rights: string[],
        rolesFieldName = ""
    ): boolean {
        if (!user) {
            return false;
        }

        if (!rolesFieldName) {
            rolesFieldName =
                user.roles && !!user.roles.length ? "roles" : "rolesString";
        }

        if (!(user as any)[rolesFieldName]) {
            return;
        }
        const userRolesStr = (user as any)[rolesFieldName] as string[];

        if (!userRolesStr?.length) {
            return;
        }

        const rolesWithRightsFromUser = fullRolesList.filter(
            (x) => userRolesStr.indexOf(x.role) !== -1
        );

        if (!rolesWithRightsFromUser?.length) {
            return false;
        }

        return rolesWithRightsFromUser.some(
            (x) =>
                x.rights?.length &&
                x.rights.some((y) => rights.indexOf(y.code) !== -1)
        );
    }
    public static userHasRight(
        user: SharedUserWrapper,
        fullRolesList: { role: string; rights?: { code: string }[] }[],
        right: string,
        rolesFieldName = ""
    ) {
        return this.userHasOneOfRights(
            user,
            fullRolesList,
            [right],
            rolesFieldName
        );
    }

    static generateAppValueCode(appValueDto: {
        appType: { code?: string };
        label?: string;
    }) {
        return (
            MainHelpers.formatToUrl(
                appValueDto?.appType?.code || "NotDefined"
            ) +
            "_" +
            MainHelpers.formatToUrl(appValueDto?.label || "NotDefined")
        );
    }

    public static userIsConsultant(user: {
        roles?: any[];
        rolesString?: string[];
    }) {
        return this.userHasRole(user, RolesList.Consultant);
    }

    public static userIsCandidate(user: {
        roles?: any[];
        rolesString?: string[];
    }) {
        return this.userHasRole(user, RolesList.Candidate);
    }

    static getSMSCountFromText(text: string): number {
        return Math.ceil(text.length / 159);
    }

    static isValidEmail(email: string): boolean {
        if (!email) {
            return false;
        }

        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        return re.test(String(email).toLowerCase());
    }

    static emailCanBeSent(email: string) {
        if (!email) {
            return false;
        }

        email = email.trim()?.toLowerCase();

        if (!SharedService.isValidEmail(email)) {
            return false;
        }

        const incorrectDomains = [
            "gmail.con",
            "gmai.com",
            "gmaill.com",
            "hitmail.com",
            "glail.com",
            "gmial.com",
            "hotmai.fr",
            "gmaiil.com",
            "gamail.com",
            "yaboo.com",
            "gmal.com",
        ];

        if (incorrectDomains.some((x) => email.endsWith(x))) {
            return false;
        }

        return true;
    }
}

export class SharedCountryService {
    private static countriesWithoutCandidateDetailFields = [
        "US", //United States
        "EG", // Egypt
        "TR", //Turkey
        "IQ", //Iraq
        "IR", //Iran
        "SY", //Syria
        "LB", //Lebanon
        "JO", //Jordan
        "SA", //Saudi Arabia
        "IL", //Israel
        "AE", //United Arab Emirates
        "KW", //Kuwait
        "BH", //Bahrain
        "QA", //Qatar
        "YE", //Yemen
    ];

    static showCandidateDetailFieldsFromCountry(country: string): boolean {
        if (!country) {
            return true;
        }

        return !this.countriesWithoutCandidateDetailFields.some(
            (x) => x?.toLowerCase() === country?.toLowerCase()?.trim()
        );
    }

    static showCandidateDetailFields(candidate: {
        addresses?: { country?: string }[];
        address?: { country?: string };
    }): boolean {
        let address = candidate?.address;

        if (typeof address === "undefined") {
            address = candidate?.addresses?.[0];
        }

        //sans date de naissance, sans nationalite, sans genre, sans situation familiale.
        return this.showCandidateDetailFieldsFromCountry(address?.country);
    }
}
