export declare class AppError extends Error {
    technicalMessage: string;
    code?: number;
    guid: string;
    constructor(technicalMessage: string, code?: number);
    static getBadRequestError(message?: string): AppError;
    static getForbiddenError(message?: string): AppError;
}
export declare class AppErrorWithMessage extends AppError {
    message: string;
    code?: number;
    constructor(message: string, code?: number);
}
