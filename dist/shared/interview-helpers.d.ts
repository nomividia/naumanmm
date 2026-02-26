export interface MMIAgency {
    agencyName: string;
    agencyCode: MMIAgencyCode;
    address: string;
    instructions?: {
        lang: "fr" | "en";
        content: string;
    }[];
}
export declare type MMIAgencyCode = "paris" | "geneva" | "london" | "valbonne" | "visio" | "newyork";
export declare class InterviewHelpers {
    static mmiAgencies: MMIAgency[];
    static mmiAgenciesForInteview: MMIAgency[];
    static getInterviewPlaceName(interviewPlaceCode: MMIAgencyCode): string;
    static getInterviewPlaceAddress(interviewPlaceCode: MMIAgencyCode, lang: "fr" | "en"): string;
}
