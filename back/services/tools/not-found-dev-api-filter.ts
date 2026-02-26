import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    NotFoundException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(NotFoundException)
export class NotFoundDevApiExceptionFilter implements ExceptionFilter {
    constructor() {}

    catch(exception: HttpException, host: ArgumentsHost) {
        // console.log("Log ~ file: not-found-filter.ts:12 ~ AngularNotFoundExceptionFilter ~ exception", this.indexHtmlFile, exception);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        // return (response.status(404) as any).send('test');
        // console.log("Log ~ file: not-found-filter.ts:15 ~ AngularNotFoundExceptionFilter ~ response", response);
        return response.status(301).redirect('/swagger');
    }
}
