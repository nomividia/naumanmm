import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
export declare class GlobalExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void;
}
