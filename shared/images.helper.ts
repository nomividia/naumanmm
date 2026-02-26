import { CandidateFileType, PersonGender } from "./shared-constants";

export interface GenericSimpleCandidate {
    id?: string;
    gender?: { code: string };
    files?: { file?: { physicalName?: string }; fileType?: { code: string } }[];
}

export interface GenericSimpleUser {
    id?: string;
    candidateId?: string;
    gender?: { code: string };
    image?: { physicalName?: string };
    candidate?: {
        files?: { file?: { physicalName?: string } }[];
    };
}

export interface GenericSimpleCandidateApplication {
    id?: string;
    gender?: { code: string };
    photoFile?: { physicalName?: string };
}

export class ImagesHelper {
    private static frontBaseUrl = "";
    private static backBaseUrl = "";

    private static usersUploadsPath = "/uploads/users/";
    private static candidatesUploadsPath = "/uploads/candidates/";
    private static candidateApplicationsUploadsPath =
        "/uploads/candidate-applications/";

    static init(frontBaseUrl: string, backBaseUrl: string) {
        this.frontBaseUrl = frontBaseUrl;
        this.backBaseUrl = backBaseUrl;
    }

    static getUserPicture(user: GenericSimpleUser) {
        if (!user?.image?.physicalName) {
            return this.getGenderImage(user?.gender);
        }
        // if (user.candidate?.files?.length && user.candidate.files[0].file) {
        //     return apiBaseUrl + this.candidatesUploadsPath + user.candidateId + '/' + user.candidate.files[0].file.physicalName;
        // } else
        if (user.candidateId) {
            return (
                this.backBaseUrl +
                this.candidatesUploadsPath +
                user.candidateId +
                "/" +
                user.image.physicalName
            );
        } else {
            return (
                this.backBaseUrl +
                this.usersUploadsPath +
                user.id +
                "/" +
                user.image.physicalName
            );
        }
    }

    static getCandidateApplicationPicture(
        apiBaseUrl: string,
        candidateApplication: GenericSimpleCandidateApplication
    ) {
        if (!candidateApplication?.photoFile?.physicalName) {
            return this.getGenderImage(candidateApplication.gender);
        }

        return (
            apiBaseUrl +
            this.candidateApplicationsUploadsPath +
            candidateApplication.id +
            "/" +
            candidateApplication.photoFile.physicalName
        );
    }

    static getCandidatePicture(candidate: GenericSimpleCandidate) {
        const profilePictureFile = this.candidateProfilePicture(candidate);

        if (!profilePictureFile?.file?.physicalName) {
            return this.getGenderImage(candidate.gender);
        }

        return (
            this.backBaseUrl +
            this.candidatesUploadsPath +
            candidate.id +
            "/" +
            profilePictureFile.file.physicalName
        );
    }

    static candidateProfilePicture(candidate: GenericSimpleCandidate) {
        return candidate?.files?.find(
            (x) => x.fileType?.code === CandidateFileType.MainPhoto
        );
    }

    static getGenderImage(gender?: { code: string }) {
        if (!gender) {
            gender = { code: PersonGender.Male };
        }

        if (gender.code === PersonGender.Male) {
            return this.frontBaseUrl + "/assets/avatars/MMI-avatar-H.png";
        }

        if (gender.code === PersonGender.Female) {
            return this.frontBaseUrl + "/assets/avatars/MMI-avatar-F.png";
        }

        return "";
    }
}
