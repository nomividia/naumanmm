/// <reference types="node" />
import { HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';
export declare abstract class BaseController {
    parseRequest(obj: any): void;
    parseNumberValues<T = any>(obj: T, numberFields: (keyof T)[]): void;
    sendResponse(response: FastifyReply, statusCode: HttpStatus, content?: any, ignoreInterceptor?: boolean): FastifyReply<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").RouteGenericInterface, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    sendResponseOk(response: FastifyReply, content?: any, ignoreInterceptor?: boolean): FastifyReply<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").RouteGenericInterface, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    sendResponseNotFound(response: FastifyReply, message?: string, ignoreInterceptor?: boolean): FastifyReply<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").RouteGenericInterface, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    sendResponseInternalServerError(response: FastifyReply, message?: string, ignoreInterceptor?: boolean): FastifyReply<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").RouteGenericInterface, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
}
