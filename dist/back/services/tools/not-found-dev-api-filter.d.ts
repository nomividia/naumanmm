/// <reference types="node" />
import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { FastifyReply } from 'fastify';
export declare class NotFoundDevApiExceptionFilter implements ExceptionFilter {
    constructor();
    catch(exception: HttpException, host: ArgumentsHost): FastifyReply<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").RouteGenericInterface, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
}
