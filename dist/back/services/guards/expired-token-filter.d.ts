import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
export declare class ExpiredTokenExceptionFilter implements ExceptionFilter {
    constructor();
    catch(exception: HttpException, host: ArgumentsHost): void;
}
