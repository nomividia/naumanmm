import { MainHelpers } from "nextalys-js-helpers";
import { CommonFileHelpers } from "nextalys-js-helpers/dist/common-file-helpers";
import {
    AppMainSender,
    AppTypes,
    CandidateFileType,
    LevelLanguage,
} from "./shared-constants";

export interface AppLanguageSimple {
    id?: string;
    code: string;
}

export interface UserDtoSimple {
    language?: AppLanguageSimple;
    languageId: string;
}

export interface CandidateDtoSimple {
    candidateCurrentJobs?: { currentJob?: { appType: { code: string } } }[];
    language?: AppLanguageSimple;
    languageId?: string;
    candidateLanguages?: {
        languageCode?: string;
        levelLanguage?: { code: string };
    }[];
    candidateCountries?: { country?: string }[];
    addresses?: { country?: string }[];
}

export interface CandidateApplicationDtoSimple {
    addresses?: { country?: string }[];
    profession?: { appType?: { code: string } };
    address?: { country?: string };
}

export interface CandidateFileDtoSimple {
    fileType?: { code?: string };
    file?: { mimeType?: string; physicalName?: string; name?: string };
}

export interface ReferentialServiceSimple {
    getAllLanguages: () => Promise<{ languages: AppLanguageSimple[] }>;
}

export interface GetCandidateOrUserMainLanguageResponse {
    language: AppLanguageSimple;
    isDefaultLanguage?: boolean;
}

export class SharedCandidatesHelpers {
    static generateCandidateFileName(
        candidateFile: CandidateFileDtoSimple,
        candidate: { firstName: string; lastName: string },
        format: boolean
    ) {
        let label = "new-file";

        if (!candidateFile?.fileType?.code) {
            return label;
        }

        switch (candidateFile.fileType.code) {
            case CandidateFileType.VariousDiploma:
                label = "Diplôme";
                break;
            case CandidateFileType.LastThreeLettersOfReference:
                label = "Lettre de référence";
                break;
            case CandidateFileType.LastThreeWorkCertificates:
                label = "Certificat";
                break;
            case CandidateFileType.PhotoOfDishes:
                label = "Photo";
                break;
            case CandidateFileType.Other:
                label = "Autre document";
                break;
            case CandidateFileType.MainPhoto:
                label = "Photo";
                break;
            case CandidateFileType.MainResume:
                label = "CV";
                break;
            case CandidateFileType.Passport:
                label = "Passeport";
                break;
            case CandidateFileType.IdentityCard:
                label = "CNI";
                break;
            case CandidateFileType.SalarySheets:
                label = "Fiche de salaire";
                break;
        }

        if (
            candidateFile.fileType.code !== CandidateFileType.Other &&
            candidate &&
            (candidate?.firstName || candidate?.lastName)
        ) {
            label += "-" + candidate.firstName + "-" + candidate.lastName;
        }

        if (format) {
            label = MainHelpers.formatToUrl(label);
        }
        // if (candidateFile?.file?.physicalName) {
        //     const ext = MainHelpers.getFileExtension(candidateFile.file.physicalName);
        //     label += '.' + ext;
        // }

        return label;
    }

    static getCandidateFileNameWithExtension(
        fileWrapper: CandidateFileDtoSimple
    ) {
        if (!fileWrapper?.file?.mimeType) {
            return fileWrapper?.file?.name || "";
        }

        return (
            fileWrapper.file.name +
            "." +
            CommonFileHelpers.getFileExtensionFromMimeType(
                fileWrapper.file.mimeType
            )
        );
    }

    private static getCandidateMainLanguage(
        candidateDto: CandidateDtoSimple,
        appLanguages: { code: string; id?: string }[]
    ) {
        let candidateLanguage: AppLanguageSimple = candidateDto?.language;

        if (appLanguages?.length) {
            const candidateLanguagesList = candidateDto?.candidateLanguages;
            // console.log(" candidateLanguagesList", candidateLanguagesList);
            if (candidateLanguagesList?.length) {
                let candidateLanguageCode: string = null;
                const orderedLevels = [
                    LevelLanguage.Maternelle,
                    LevelLanguage.Courant,
                    LevelLanguage.Scolaire,
                ];

                for (const langLevel of orderedLevels) {
                    const langFoundItem = candidateLanguagesList.find(
                        (x) =>
                            x?.levelLanguage?.code &&
                            x?.levelLanguage?.code === langLevel
                    );

                    if (langFoundItem?.languageCode) {
                        candidateLanguageCode = langFoundItem.languageCode;
                        // console.log("found from lang level", candidateLanguageCode);
                        break;
                    }
                }
                if (!candidateLanguageCode) {
                    candidateLanguageCode =
                        candidateDto?.candidateLanguages?.map(
                            (x) => x?.languageCode
                        )?.[0];
                    // console.log("found by default", candidateLanguageCode);
                }

                if (candidateLanguageCode) {
                    candidateLanguage = appLanguages?.find(
                        (x) => x.code === candidateLanguageCode
                    );
                }
                // console.log("candidateLanguageCode", candidateLanguageCode);
            }
        }

        return candidateLanguage;
    }

    static async getCandidateOrUserMainLanguage(
        candidateDto: CandidateDtoSimple,
        userDto: UserDtoSimple,
        referentialService: ReferentialServiceSimple
    ): Promise<GetCandidateOrUserMainLanguageResponse> {
        // let languageCode = userDto?.language?.code;
        // console.log("languageCode from user 1", languageCode);
        let appLanguage: AppLanguageSimple = userDto?.language;
        let getLanguagesResponse: { languages: AppLanguageSimple[] };
        let isDefaultLanguage = false;

        if (!appLanguage) {
            if (referentialService) {
                getLanguagesResponse =
                    await referentialService?.getAllLanguages();
            }

            if (!!userDto?.languageId) {
                appLanguage = getLanguagesResponse?.languages?.find(
                    (x) => x.id === userDto.languageId
                );
                // languageCode = appLanguage?.code;
                // console.log("languageCode from user 2", languageCode);
            }

            if (!appLanguage) {
                appLanguage = SharedCandidatesHelpers.getCandidateMainLanguage(
                    candidateDto,
                    getLanguagesResponse?.languages
                );
            }
        }

        if (
            !appLanguage &&
            getLanguagesResponse?.languages?.length &&
            candidateDto?.addresses?.length
        ) {
            const country = candidateDto?.addresses?.[0]?.country;

            if (country) {
                const langCode = SharedCandidatesHelpers.getDefaultLanguage(
                    null,
                    country
                );

                if (langCode) {
                    appLanguage = getLanguagesResponse?.languages?.find(
                        (x) => x.code === langCode
                    );
                    isDefaultLanguage = true;
                }
            }
        }

        return { language: appLanguage, isDefaultLanguage };
    }
    static async getMailSenderFromCandidate(
        candidateDto: CandidateDtoSimple,
        userDto: UserDtoSimple,
        referentialService: ReferentialServiceSimple,
        consultantEmail?: string
    ) {
        let jobAppTypeCode: string;
        let appLanguage: AppLanguageSimple;

        if (candidateDto) {
            jobAppTypeCode = candidateDto?.candidateCurrentJobs?.find(
                (x) => !!x?.currentJob?.appType?.code
            )?.currentJob?.appType?.code;
        }

        if (candidateDto || userDto) {
            const response = await this.getCandidateOrUserMainLanguage(
                candidateDto,
                userDto,
                referentialService
            );

            appLanguage = response.language;
        }

        return this.getMailSender(
            jobAppTypeCode,
            appLanguage?.code as "fr" | "en",
            undefined,
            consultantEmail
        );
    }

    static getMailSenderFromCandidateApplication(
        candidateApplication: CandidateApplicationDtoSimple,
        forceLangCode?: "fr" | "en",
        consultantEmail?: string
    ) {
        const jobAppTypeCode = candidateApplication?.profession?.appType?.code;
        const country =
            candidateApplication?.addresses?.[0]?.country ||
            candidateApplication?.address?.country;

        return this.getMailSender(
            jobAppTypeCode,
            forceLangCode,
            country,
            consultantEmail
        );
    }

    static getLanguageFromCandidateApplication(
        candidateApplication: CandidateApplicationDtoSimple
    ) {
        const country =
            candidateApplication?.addresses?.[0]?.country ||
            candidateApplication?.address?.country;

        return SharedCandidatesHelpers.getDefaultLanguage(null, country);
    }

    static async getLanguageFromCandidate(
        candidateDto: CandidateDtoSimple,
        referentialService: ReferentialServiceSimple
    ) {
        const response = await this.getCandidateOrUserMainLanguage(
            candidateDto,
            null,
            referentialService
        );

        return response.language;
    }

    static getMailSender(
        jobAppTypeCode: string,
        lang?: "fr" | "en",
        countryCode?: string,
        consultantEmail?: string
    ) {
        // Fallback to default sender
        return AppMainSender;

        const personnelDeMaisonMailSenderFR =
            "contact@personneldemaison.agency";
        const personnelDeMaisonMailSenderEN = "contact@householdstaff.agency";

        const yachtingMailSenderFR = "contact@recrutementyacht.agency";
        const yachtingMailSenderEN = "contact@yachtcrew.agency";

        lang = SharedCandidatesHelpers.getDefaultLanguage(lang, countryCode);
        let mailSender = personnelDeMaisonMailSenderFR;
        if (lang === "en") {
            mailSender = personnelDeMaisonMailSenderEN;
        }

        if (jobAppTypeCode) {
            switch (jobAppTypeCode) {
                case AppTypes.JobCategoryCode:
                    switch (lang) {
                        case "fr":
                            mailSender = personnelDeMaisonMailSenderFR;
                            break;
                        case "en":
                            mailSender = personnelDeMaisonMailSenderEN;
                            break;
                    }
                    break;
                case AppTypes.JobNannyCategoryCode:
                    switch (lang) {
                        case "fr":
                            mailSender = personnelDeMaisonMailSenderFR;
                            break;
                        case "en":
                            mailSender = personnelDeMaisonMailSenderEN;
                            break;
                    }
                    break;
                case AppTypes.JobYachtingCategoryCode:
                    switch (lang) {
                        case "fr":
                            mailSender = yachtingMailSenderFR;
                            break;
                        case "en":
                            mailSender = yachtingMailSenderEN;
                            break;
                    }
                    break;
            }
        }
        return mailSender;

        //         contact@personneldemaison.agency
        // contact@housefoldstaff.agency
        // contact@recrutementyacht.agency
        // contact@yachtcrew.agency
    }

    static getDefaultLanguage(
        lang?: "fr" | "en",
        countryCode?: string
    ): "en" | "fr" {
        if (!lang && !!countryCode) {
            switch (countryCode.toLowerCase()) {
                case "fr":
                case "ch":
                    lang = "fr";
                    break;
                case "ai":
                case "us":
                case "gb":
                case "au":
                case "za":
                    lang = "en";
                    break;
                default:
                    lang = "en";
            }
        }

        if (!lang) {
            lang = "en";
        }

        if (lang !== "fr" && lang !== "en") {
            lang = "en";
        }

        return lang;
    }
}
