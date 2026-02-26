export interface ConsultantGoogleLinkMapping {
    consultantIds: string[];
    googleReviewUrl: string;
    agencyLocation: string;
}
export declare const CONSULTANT_GOOGLE_LINK_MAPPINGS: ConsultantGoogleLinkMapping[];
export declare const SWISS_GOOGLE_REVIEW_URL = "https://g.page/r/CdSu6ip-awYXEBM/review";
export declare class ConsultantGoogleLinkHelper {
    static getGoogleReviewUrlByConsultant(consultantId: string): string | null;
    static getGoogleReviewUrlByLocation(location: string): string | null;
}
