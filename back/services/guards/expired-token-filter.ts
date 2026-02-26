import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AppResponseCode } from '../../../shared/shared-constants';
import { GenericResponse } from '../../models/responses/generic-response';
import { ExpiredTokenException } from './expired-token-exception';

@Catch(ExpiredTokenException)
export class ExpiredTokenExceptionFilter implements ExceptionFilter {
    constructor() {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        response.status(403);
        response.send({
            success: false,
            message: 'Token expiré',
            statusCode: AppResponseCode.ExpiredToken,
        } as GenericResponse);
    }
}
