"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.additionalUserFieldsForTokenPayloadFunction = exports.userRolesRules = exports.userFieldsForLogin = exports.UserRelationsForLogin = exports.AuthCustomRules = void 0;
const shared_constants_1 = require("../../shared/shared-constants");
const app_error_1 = require("../models/app-error");
function AuthCustomRules(user) {
    const ok = !!user;
    if (!ok) {
        throw new app_error_1.AppErrorWithMessage('Custom error', 403);
    }
}
exports.AuthCustomRules = AuthCustomRules;
exports.UserRelationsForLogin = [
    'image',
    'roles',
    'candidate',
    'candidate.files',
    'candidate.files.file',
    'candidate.files.fileType',
];
exports.userFieldsForLogin = ['userName', 'mail'];
exports.userRolesRules = [
    {
        roleToAdd: shared_constants_1.RolesList.AdminTech,
        allowedRoles: [shared_constants_1.RolesList.AdminTech],
    },
    {
        roleToAdd: shared_constants_1.RolesList.Admin,
        allowedRoles: [shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech],
    },
    {
        roleToAdd: shared_constants_1.RolesList.Consultant,
        allowedRoles: [
            shared_constants_1.RolesList.Consultant,
            shared_constants_1.RolesList.RH,
            shared_constants_1.RolesList.Admin,
            shared_constants_1.RolesList.AdminTech,
        ],
    },
    {
        roleToAdd: shared_constants_1.RolesList.Candidate,
        allowedRoles: [
            shared_constants_1.RolesList.Candidate,
            shared_constants_1.RolesList.RH,
            shared_constants_1.RolesList.Consultant,
            shared_constants_1.RolesList.Admin,
            shared_constants_1.RolesList.AdminTech,
        ],
    },
    {
        roleToAdd: shared_constants_1.RolesList.RH,
        allowedRoles: [shared_constants_1.RolesList.RH, shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech],
    },
    {
        roleToAdd: shared_constants_1.RolesList.Newsletter,
        allowedRoles: [
            shared_constants_1.RolesList.Newsletter,
            shared_constants_1.RolesList.Admin,
            shared_constants_1.RolesList.AdminTech,
        ],
    },
];
const additionalUserFieldsForTokenPayloadFunction = (payload, user) => {
    var _a, _b, _c;
    if ((_b = (_a = user.candidate) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b.length) {
        const mainPhotoFile = (_c = user.candidate.files.find((x) => x.fileType && x.fileType.code === shared_constants_1.CandidateFileType.MainPhoto)) === null || _c === void 0 ? void 0 : _c.file;
        if (mainPhotoFile) {
            payload.imageName = mainPhotoFile.name || null;
            payload.imagePhysicalName = mainPhotoFile.physicalName || null;
        }
    }
};
exports.additionalUserFieldsForTokenPayloadFunction = additionalUserFieldsForTokenPayloadFunction;
//# sourceMappingURL=auth-custom-rules.js.map