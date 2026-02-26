export declare class TranslateResponse {
    data: translations[];
}
export declare class translations {
    translatedText: string;
}
export declare class TranslateService {
    static getTranslation(request: string): Promise<any>;
}
