export interface JwtPayload {
    userName: string;
    id: string;
    roles: string[];
    iat?: number;
    exp?: number;
    language: {
        id?: string;
        label: string;
        icon?: string;
        code: string;
    };
    languageId: string;
    mail: string;
    firstName: string;
    imageName?: string;
    candidateId?: string;
    imagePhysicalName?: string;
}
