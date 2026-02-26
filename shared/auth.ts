import { RoutesList } from "./routes";
import { RolesList } from "./shared-constants";

export const additionalUserFieldsForTokenPayload: string[] = [
    "lastName",
    "candidateId",
];
export const homePagesByRoles: { role: RolesList; homePage: string }[] = [
    { role: RolesList.Candidate, homePage: RoutesList.Candidate_MyDashBoard },
];
export const defaultHomePageForUser = "/" + RoutesList.AdminHome;
