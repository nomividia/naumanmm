"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedCountryService = exports.SharedService = exports.SharedHelpers = void 0;
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const shared_constants_1 = require("./shared-constants");
class SharedHelpers {
    static getYearListFromYear(fromYear, nullExclude) {
        if (!fromYear) {
            fromYear = 2018;
        }
        const yearList = [];
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
    static loadMonthListPassedFromYear(year) {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const monthList = [];
        monthList.push({ label: "Tous", value: null });
        for (let i = 0; i <= 11; i++) {
            if (year === currentYear && i > currentMonth) {
                continue;
            }
            monthList.push({
                label: nextalys_js_helpers_1.DateHelpers.GetMonthName(i),
                value: i + 1,
            });
        }
        return monthList;
    }
}
exports.SharedHelpers = SharedHelpers;
class SharedService {
    static userHasRole(user, role, rolesFieldName = null) {
        return this.userHasOneOfRoles(user, [role], rolesFieldName);
    }
    static userHasOneOfRoles(user, roles, rolesFieldName = null) {
        if (!user) {
            return false;
        }
        if (!rolesFieldName) {
            rolesFieldName =
                user.roles && !!user.roles.length ? "roles" : "rolesString";
        }
        return (user &&
            user[rolesFieldName] &&
            user[rolesFieldName].some((x) => {
                if (typeof x === "string") {
                    return roles.indexOf(x) !== -1;
                }
                else if (!!(x === null || x === void 0 ? void 0 : x.role)) {
                    return roles.some((y) => x.role === y);
                }
                return false;
            }));
    }
    static userIsAdmin(user) {
        return this.userHasRole(user, shared_constants_1.RolesList.Admin);
    }
    static userIsAdminTech(user) {
        return this.userHasRole(user, shared_constants_1.RolesList.AdminTech);
    }
    static userIsRH(user) {
        return this.userHasRole(user, shared_constants_1.RolesList.RH);
    }
    static userHasOneOfRights(user, fullRolesList, rights, rolesFieldName = "") {
        if (!user) {
            return false;
        }
        if (!rolesFieldName) {
            rolesFieldName =
                user.roles && !!user.roles.length ? "roles" : "rolesString";
        }
        if (!user[rolesFieldName]) {
            return;
        }
        const userRolesStr = user[rolesFieldName];
        if (!(userRolesStr === null || userRolesStr === void 0 ? void 0 : userRolesStr.length)) {
            return;
        }
        const rolesWithRightsFromUser = fullRolesList.filter((x) => userRolesStr.indexOf(x.role) !== -1);
        if (!(rolesWithRightsFromUser === null || rolesWithRightsFromUser === void 0 ? void 0 : rolesWithRightsFromUser.length)) {
            return false;
        }
        return rolesWithRightsFromUser.some((x) => {
            var _a;
            return ((_a = x.rights) === null || _a === void 0 ? void 0 : _a.length) &&
                x.rights.some((y) => rights.indexOf(y.code) !== -1);
        });
    }
    static userHasRight(user, fullRolesList, right, rolesFieldName = "") {
        return this.userHasOneOfRights(user, fullRolesList, [right], rolesFieldName);
    }
    static generateAppValueCode(appValueDto) {
        var _a;
        return (nextalys_js_helpers_1.MainHelpers.formatToUrl(((_a = appValueDto === null || appValueDto === void 0 ? void 0 : appValueDto.appType) === null || _a === void 0 ? void 0 : _a.code) || "NotDefined") +
            "_" +
            nextalys_js_helpers_1.MainHelpers.formatToUrl((appValueDto === null || appValueDto === void 0 ? void 0 : appValueDto.label) || "NotDefined"));
    }
    static userIsConsultant(user) {
        return this.userHasRole(user, shared_constants_1.RolesList.Consultant);
    }
    static userIsCandidate(user) {
        return this.userHasRole(user, shared_constants_1.RolesList.Candidate);
    }
    static getSMSCountFromText(text) {
        return Math.ceil(text.length / 159);
    }
    static isValidEmail(email) {
        if (!email) {
            return false;
        }
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return re.test(String(email).toLowerCase());
    }
    static emailCanBeSent(email) {
        var _a;
        if (!email) {
            return false;
        }
        email = (_a = email.trim()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
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
exports.SharedService = SharedService;
class SharedCountryService {
    static showCandidateDetailFieldsFromCountry(country) {
        if (!country) {
            return true;
        }
        return !this.countriesWithoutCandidateDetailFields.some((x) => { var _a; return (x === null || x === void 0 ? void 0 : x.toLowerCase()) === ((_a = country === null || country === void 0 ? void 0 : country.toLowerCase()) === null || _a === void 0 ? void 0 : _a.trim()); });
    }
    static showCandidateDetailFields(candidate) {
        var _a;
        let address = candidate === null || candidate === void 0 ? void 0 : candidate.address;
        if (typeof address === "undefined") {
            address = (_a = candidate === null || candidate === void 0 ? void 0 : candidate.addresses) === null || _a === void 0 ? void 0 : _a[0];
        }
        return this.showCandidateDetailFieldsFromCountry(address === null || address === void 0 ? void 0 : address.country);
    }
}
exports.SharedCountryService = SharedCountryService;
SharedCountryService.countriesWithoutCandidateDetailFields = [
    "US",
    "EG",
    "TR",
    "IQ",
    "IR",
    "SY",
    "LB",
    "JO",
    "SA",
    "IL",
    "AE",
    "KW",
    "BH",
    "QA",
    "YE",
];
//# sourceMappingURL=shared-service.js.map