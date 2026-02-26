import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
export declare class AngularNotFoundExceptionFilter implements ExceptionFilter {
    private indexFullPath;
    constructor(indexFullPath: string);
    catch(exception: HttpException, host: ArgumentsHost): Promise<void>;
}
