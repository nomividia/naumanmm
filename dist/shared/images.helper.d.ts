export interface GenericSimpleCandidate {
    id?: string;
    gender?: {
        code: string;
    };
    files?: {
        file?: {
            physicalName?: string;
        };
        fileType?: {
            code: string;
        };
    }[];
}
export interface GenericSimpleUser {
    id?: string;
    candidateId?: string;
    gender?: {
        code: string;
    };
    image?: {
        physicalName?: string;
    };
    candidate?: {
        files?: {
            file?: {
                physicalName?: string;
            };
        }[];
    };
}
export interface GenericSimpleCandidateApplication {
    id?: string;
    gender?: {
        code: string;
    };
    photoFile?: {
        physicalName?: string;
    };
}
export declare class ImagesHelper {
    private static frontBaseUrl;
    private static backBaseUrl;
    private static usersUploadsPath;
    private static candidatesUploadsPath;
    private static candidateApplicationsUploadsPath;
    static init(frontBaseUrl: string, backBaseUrl: string): void;
    static getUserPicture(user: GenericSimpleUser): string;
    static getCandidateApplicationPicture(apiBaseUrl: string, candidateApplication: GenericSimpleCandidateApplication): string;
    static getCandidatePicture(candidate: GenericSimpleCandidate): string;
    static candidateProfilePicture(candidate: GenericSimpleCandidate): {
        file?: {
            physicalName?: string;
        };
        fileType?: {
            code: string;
        };
    };
    static getGenderImage(gender?: {
        code: string;
    }): string;
}
