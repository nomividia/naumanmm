"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultHomePageForUser = exports.homePagesByRoles = exports.additionalUserFieldsForTokenPayload = void 0;
const routes_1 = require("./routes");
const shared_constants_1 = require("./shared-constants");
exports.additionalUserFieldsForTokenPayload = [
    "lastName",
    "candidateId",
];
exports.homePagesByRoles = [
    { role: shared_constants_1.RolesList.Candidate, homePage: routes_1.RoutesList.Candidate_MyDashBoard },
];
exports.defaultHomePageForUser = "/" + routes_1.RoutesList.AdminHome;
//# sourceMappingURL=auth.js.map