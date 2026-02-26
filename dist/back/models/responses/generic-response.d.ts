export declare class GenericResponse {
    success: boolean;
    message?: string;
    error?: any;
    statusCode?: number;
    errorGuid?: string;
    token?: string;
    originalError?: any;
    constructor(success?: boolean, message?: any);
    handleError(error: any, preventLogToFile?: boolean): Promise<void>;
}
export declare class GenericResponseWithData<T = any> extends GenericResponse {
    data?: T;
}
export declare class GetItemResponse<T = any> extends GenericResponse {
    item?: T;
}
export declare class GetItemsListResponse<T = any> extends GenericResponse {
    items?: T[];
}
