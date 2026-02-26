import { HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { DateHelpers } from 'nextalys-js-helpers';
import { GenericResponse } from '../models/responses/generic-response';

export abstract class BaseController {
    public parseRequest(obj: any) {
        DateHelpers.parseAllDatesRecursive(obj, true);
    }

    public parseNumberValues<T = any>(obj: T, numberFields: (keyof T)[]) {
        if (!obj) return;
        for (const key in obj) {
            if (
                numberFields.indexOf(key) !== -1 &&
                Object.prototype.hasOwnProperty.call(obj, key)
            ) {
                obj[key as any] = parseFloat(obj[key as any]);
            }
        }
    }
    sendResponse(
        response: FastifyReply,
        statusCode: HttpStatus,
        content?: any,
        ignoreInterceptor?: boolean,
    ) {
        if (!content)
            content = new GenericResponse(
                statusCode >= HttpStatus.OK &&
                    statusCode < HttpStatus.AMBIGUOUS,
                '',
            );
        if (ignoreInterceptor) {
            response.header(
                'access-control-expose-headers',
                'nxs-ignore-interceptor',
            );
            response.header('nxs-ignore-interceptor', 'true');
        }
        return response.status(statusCode).send(content);
    }

    sendResponseOk(
        response: FastifyReply,
        content?: any,
        ignoreInterceptor?: boolean,
    ) {
        return this.sendResponse(
            response,
            HttpStatus.OK,
            ignoreInterceptor,
            content,
        );
    }

    sendResponseNotFound(
        response: FastifyReply,
        message?: string,
        ignoreInterceptor?: boolean,
    ) {
        if (!message) message = 'Not Found';
        return this.sendResponse(
            response,
            HttpStatus.NOT_FOUND,
            new GenericResponse(false, message),
            ignoreInterceptor,
        );
    }

    sendResponseInternalServerError(
        response: FastifyReply,
        message?: string,
        ignoreInterceptor?: boolean,
    ) {
        if (!message) message = 'Error';
        return this.sendResponse(
            response,
            HttpStatus.INTERNAL_SERVER_ERROR,
            new GenericResponse(false, message),
            ignoreInterceptor,
        );
    }
}
