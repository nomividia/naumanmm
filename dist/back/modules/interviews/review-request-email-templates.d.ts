export interface ReviewRequestEmailContent {
    subject: string;
    body: string;
}
export declare class ReviewRequestEmailTemplates {
    static getFrenchTemplate(candidateFirstName: string, googleReviewUrl: string): ReviewRequestEmailContent;
    static getEnglishTemplate(candidateFirstName: string, googleReviewUrl: string): ReviewRequestEmailContent;
}
