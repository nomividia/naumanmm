import { MainHelpers } from 'nextalys-js-helpers';

export class AppError extends Error {
    public guid: string;
    constructor(public technicalMessage: string, public code?: number) {
        super(technicalMessage);
        this.guid = MainHelpers.generateGuid();
    }

    public static getBadRequestError(message?: string): AppError {
        return new AppError(
            'Bad Request' + (!!message ? ' - ' + message : ''),
            400,
        );
    }
    public static getForbiddenError(message?: string): AppError {
        return new AppError(
            'Forbidden' + (!!message ? ' - ' + message : ''),
            403,
        );
    }
}

export class AppErrorWithMessage extends AppError {
    constructor(public message: string, public code?: number) {
        super(message, code);
        this.message = message;
    }
}
