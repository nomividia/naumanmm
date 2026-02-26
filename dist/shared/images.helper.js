"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesHelper = void 0;
const shared_constants_1 = require("./shared-constants");
class ImagesHelper {
    static init(frontBaseUrl, backBaseUrl) {
        this.frontBaseUrl = frontBaseUrl;
        this.backBaseUrl = backBaseUrl;
    }
    static getUserPicture(user) {
        var _a;
        if (!((_a = user === null || user === void 0 ? void 0 : user.image) === null || _a === void 0 ? void 0 : _a.physicalName)) {
            return this.getGenderImage(user === null || user === void 0 ? void 0 : user.gender);
        }
        if (user.candidateId) {
            return (this.backBaseUrl +
                this.candidatesUploadsPath +
                user.candidateId +
                "/" +
                user.image.physicalName);
        }
        else {
            return (this.backBaseUrl +
                this.usersUploadsPath +
                user.id +
                "/" +
                user.image.physicalName);
        }
    }
    static getCandidateApplicationPicture(apiBaseUrl, candidateApplication) {
        var _a;
        if (!((_a = candidateApplication === null || candidateApplication === void 0 ? void 0 : candidateApplication.photoFile) === null || _a === void 0 ? void 0 : _a.physicalName)) {
            return this.getGenderImage(candidateApplication.gender);
        }
        return (apiBaseUrl +
            this.candidateApplicationsUploadsPath +
            candidateApplication.id +
            "/" +
            candidateApplication.photoFile.physicalName);
    }
    static getCandidatePicture(candidate) {
        var _a;
        const profilePictureFile = this.candidateProfilePicture(candidate);
        if (!((_a = profilePictureFile === null || profilePictureFile === void 0 ? void 0 : profilePictureFile.file) === null || _a === void 0 ? void 0 : _a.physicalName)) {
            return this.getGenderImage(candidate.gender);
        }
        return (this.backBaseUrl +
            this.candidatesUploadsPath +
            candidate.id +
            "/" +
            profilePictureFile.file.physicalName);
    }
    static candidateProfilePicture(candidate) {
        var _a;
        return (_a = candidate === null || candidate === void 0 ? void 0 : candidate.files) === null || _a === void 0 ? void 0 : _a.find((x) => { var _a; return ((_a = x.fileType) === null || _a === void 0 ? void 0 : _a.code) === shared_constants_1.CandidateFileType.MainPhoto; });
    }
    static getGenderImage(gender) {
        if (!gender) {
            gender = { code: shared_constants_1.PersonGender.Male };
        }
        if (gender.code === shared_constants_1.PersonGender.Male) {
            return this.frontBaseUrl + "/assets/avatars/MMI-avatar-H.png";
        }
        if (gender.code === shared_constants_1.PersonGender.Female) {
            return this.frontBaseUrl + "/assets/avatars/MMI-avatar-F.png";
        }
        return "";
    }
}
exports.ImagesHelper = ImagesHelper;
ImagesHelper.frontBaseUrl = "";
ImagesHelper.backBaseUrl = "";
ImagesHelper.usersUploadsPath = "/uploads/users/";
ImagesHelper.candidatesUploadsPath = "/uploads/candidates/";
ImagesHelper.candidateApplicationsUploadsPath = "/uploads/candidate-applications/";
//# sourceMappingURL=images.helper.js.map