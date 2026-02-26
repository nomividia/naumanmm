export interface BaseSimpleError {
    success: boolean;
    message?: string;
    error?: any;
    statusCode?: number;
    errorGuid?: string;
    token?: string;
}

export interface ObsSimple<T> {
    forEach(next: (value: T) => void): Promise<void>;
}

export interface BaseComponentSimple {
    sendApiRequest: <T>(obs: ObsSimple<T>, customSubject?: any) => Promise<T>;
    setTimeout: (
        cb: () => any,
        interval?: number,
        alreadyExistingTimeoutId?: number | string,
    ) => void;
    destroySubject: any;
    eventsCollector: { collect: (...args: any[]) => void };
    handleErrorResponse(
        response: BaseSimpleError,
        showReportButton?: boolean,
    ): boolean;
}

export interface ComponentWithLoading {
    loading: boolean;
}

export interface ComponentWithDialogService {
    dialogService?: {
        showDialog(msg: string): void;
        showSnackBar(msg: string): void;
    };
}
