export interface AppLanguageSimple {
    id?: string;
    code: string;
}
export interface UserDtoSimple {
    language?: AppLanguageSimple;
    languageId: string;
}
export interface CandidateDtoSimple {
    candidateCurrentJobs?: {
        currentJob?: {
            appType: {
                code: string;
            };
        };
    }[];
    language?: AppLanguageSimple;
    languageId?: string;
    candidateLanguages?: {
        languageCode?: string;
        levelLanguage?: {
            code: string;
        };
    }[];
    candidateCountries?: {
        country?: string;
    }[];
    addresses?: {
        country?: string;
    }[];
}
export interface CandidateApplicationDtoSimple {
    addresses?: {
        country?: string;
    }[];
    profession?: {
        appType?: {
            code: string;
        };
    };
    address?: {
        country?: string;
    };
}
export interface CandidateFileDtoSimple {
    fileType?: {
        code?: string;
    };
    file?: {
        mimeType?: string;
        physicalName?: string;
        name?: string;
    };
}
export interface ReferentialServiceSimple {
    getAllLanguages: () => Promise<{
        languages: AppLanguageSimple[];
    }>;
}
export interface GetCandidateOrUserMainLanguageResponse {
    language: AppLanguageSimple;
    isDefaultLanguage?: boolean;
}
export declare class SharedCandidatesHelpers {
    static generateCandidateFileName(candidateFile: CandidateFileDtoSimple, candidate: {
        firstName: string;
        lastName: string;
    }, format: boolean): string;
    static getCandidateFileNameWithExtension(fileWrapper: CandidateFileDtoSimple): string;
    private static getCandidateMainLanguage;
    static getCandidateOrUserMainLanguage(candidateDto: CandidateDtoSimple, userDto: UserDtoSimple, referentialService: ReferentialServiceSimple): Promise<GetCandidateOrUserMainLanguageResponse>;
    static getMailSenderFromCandidate(candidateDto: CandidateDtoSimple, userDto: UserDtoSimple, referentialService: ReferentialServiceSimple, consultantEmail?: string): Promise<string>;
    static getMailSenderFromCandidateApplication(candidateApplication: CandidateApplicationDtoSimple, forceLangCode?: "fr" | "en", consultantEmail?: string): string;
    static getLanguageFromCandidateApplication(candidateApplication: CandidateApplicationDtoSimple): "fr" | "en";
    static getLanguageFromCandidate(candidateDto: CandidateDtoSimple, referentialService: ReferentialServiceSimple): Promise<AppLanguageSimple>;
    static getMailSender(jobAppTypeCode: string, lang?: "fr" | "en", countryCode?: string, consultantEmail?: string): string;
    static getDefaultLanguage(lang?: "fr" | "en", countryCode?: string): "en" | "fr";
}
