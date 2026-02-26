import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    NotFoundException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
// import { ServerResponse } from 'http';
import { FileHelpers } from 'nextalys-node-helpers';
// const fs = require('fs');
const path = require('path');

@Catch(NotFoundException)
export class AngularNotFoundExceptionFilter implements ExceptionFilter {
    constructor(
        // private indexHtmlFile: string, private filePath: string
        private indexFullPath: string,
    ) {}

    async catch(exception: HttpException, host: ArgumentsHost) {
        let reply: FastifyReply;
        try {
            // console.log("Log ~ file: not-found-filter.ts:11 ~ AngularNotFoundExceptionFilter ~ exception", exception, this.indexHtmlFile);
            // console.log("Log ~ file: not-found-filter.ts:12 ~ AngularNotFoundExceptionFilter ~ exception", this.indexHtmlFile, exception);
            const ctx = host.switchToHttp();
            reply = ctx.getResponse<FastifyReply>();
            reply.hijack();
            // return (response.status(404) as any).send('test');
            // console.log("Log ~ file: not-found-filter.ts:15 ~ AngularNotFoundExceptionFilter ~ response", response);
            // const fullPath = path.join(this.filePath, this.indexHtmlFile);
            // const str = await FileHelpers.readFile(fullPath, true) as string;
            const fileContent = await FileHelpers.readFile(
                this.indexFullPath,
                true,
            );
            // reply.send({ test: 'toto' });
            // reply.header('Content-Type', 'text/html');
            // reply.compileSerializationSchema
            reply.raw.setHeader('Content-Type', 'text/html');
            reply.raw.end(fileContent);

            // reply.raw.end.send(fileContent);
            // console.log("Log ~ file: not-found-filter.ts:22 ~ AngularNotFoundExceptionFilter ~ str", str);
            // return response.status(200).header('Content-Type', 'text/html').send('tesst');
            // response.status(200).send('tesst');

            // const stream = fs.createReadStream(fullPath, 'utf8');
            // console.log("Log ~ file: not-found-filter.ts:22 ~ AngularNotFoundExceptionFilter ~ stream", stream);
            // return response.status(200).header('Content-Type', 'text/html').send(stream);
            // reply.send(stream)
            // const buffer = ('demo.png')
            // reply.type('image/png') // if you don't set the content, the image would be downloaded by browser instead of viewed
            // reply.send(buffer)

            // reply.header(
            //     'Content-Disposition',
            //     'attachment; filename=foo.sql'
            //   reply.send(stream).type('application/sql').code(200)

            // return await response.status(200).header('Content-Type', 'text/html').sendFile(this.indexHtmlFile, this.filePath, { serveDotFiles: false, cacheControl: false, index: 'index.html' });
            // return response.send('test');
        } catch (error) {
            console.log(
                'Log ~ file: not-found-filter.ts:49 ~ AngularNotFoundExceptionFilter ~ error',
                error,
            );
            // reply?.send({ error: error });

            reply?.raw?.end('Error');
        }
    }
}
