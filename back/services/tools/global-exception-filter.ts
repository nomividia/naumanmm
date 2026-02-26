import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';
import { GenericResponse } from '../../models/responses/generic-response';

@Catch()
export class GlobalExceptionFilter
    extends BaseExceptionFilter
    implements ExceptionFilter
{
    catch(exception: HttpException, host: ArgumentsHost) {
        // console.log("GlobalExceptionFilter", exception);
        // console.log("GlobalExceptionFilter", exception);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const jsonResponse = new GenericResponse();
        if (!(exception instanceof NotFoundException)) {
            (exception as any).originalUrl =
                ctx.getRequest<FastifyRequest>()?.url;
            jsonResponse.handleError(exception);
            response.send(jsonResponse);
        } else {
            const request = ctx.getRequest<FastifyRequest>();
            const status = exception?.getStatus ? exception.getStatus() : 0;
            response.status(status).send({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }
    }
}
