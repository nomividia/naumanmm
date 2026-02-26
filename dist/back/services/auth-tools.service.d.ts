import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';
import { JwtPayload } from '../../shared/jwt-payload';
import { UserDto } from '../models/dto/user-dto';
import { ApplicationBaseService } from './base-service';
export declare type JwtDecodeError = 'TokenExpiredError' | 'JsonWebTokenError' | 'NoTokenError' | 'NoRequestData';
export interface DecodeTokenResponse {
    payload?: JwtPayload;
    error?: JwtDecodeError;
}
export declare class AuthToolsService extends ApplicationBaseService {
    readonly fastifyRequest: FastifyRequest;
    readonly jwtService: JwtService;
    constructor(fastifyRequest: FastifyRequest, jwtService: JwtService);
    getLanguagesFromRequest(): any;
    getLanguageFromRequest(): any;
    getLanguageFromHeader(): 'fr' | 'en';
    getLanguageFromRequestSplitted(): any;
    static createUserToken(jwtService: JwtService, user: UserDto): string;
    static getRequestFromContext(context: ExecutionContext): FastifyRequest;
    static getResponseFromContext(context: ExecutionContext): FastifyReply;
    static getJwtPayloadFromRequest(jwtService: JwtService, request: FastifyRequest, ignoreExpiration: boolean): DecodeTokenResponse;
    static getJwtTokenFromAuthHeader(authorizationHeader: string): string;
    static getJwtPayloadFromAuthHeader(jwtService: JwtService, authorizationHeader: string, ignoreExpiration: boolean): DecodeTokenResponse;
    static decodeToken(jwtService: JwtService, encodedToken: string, ignoreExpiration: boolean): DecodeTokenResponse;
    getCurrentPayload(ignoreExpiration: boolean): JwtPayload;
    getCurrentPayloadFromHeaderOrCookie(ignoreExpiration: boolean): JwtPayload;
}
