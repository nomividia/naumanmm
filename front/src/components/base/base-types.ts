export interface BaseRequest {
    start?: number;
    length?: number;
    orderby?: string;
    order?: string;
    search?: string;
}

export interface BaseWrapper<T> {
    item: T;
    expanded: boolean;
}
