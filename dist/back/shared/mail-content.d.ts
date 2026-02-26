export declare type AppMailType = 'CandidateApplicationRefused' | 'NewCandidateAccount' | 'SendJobOfferToCandidate' | 'NewAccountPassword' | 'NewAccountAfterJobAdderMigration' | 'NewCandidateApplication' | 'CandidateApplicationRefusedCoupleFormation' | 'CandidateApplicationRefusedCandidatesPlatform' | 'CandidateApplicationRefusedCreateCandidate' | 'CandidateApplicationAccepted' | 'SendFollwUpAvailability' | 'JobOfferPositionIsFilled';
export interface JobOfferMailData {
    ref?: string;
    title?: string;
}
export declare class MailContent {
    private static mailContentData;
    static getMailContentAndSubject(mailType: AppMailType, addMailFooter?: boolean, lang?: 'fr' | 'en', countryCode?: string, injectValues?: string[], jobOfferData?: JobOfferMailData): {
        content: string;
        subject: string;
    };
    private static formatJobOfferInfo;
}
