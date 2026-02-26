import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
// import * as bodyParser from 'body-parser';
import * as path from 'path';
import { Environment } from './environment/environment';
// import * as fastify from 'fastify';
// import { FastifyReply } from 'fastify';
// import Fastify from 'fastify';
// import * as cookieParser from 'cookie-parser';
import fastifyCookie from '@fastify/cookie';
import * as fastifyStatic from '@fastify/static';
import { ExceptionFilter } from '@nestjs/common';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { FastifyReply, FastifyRequest } from 'fastify';
import { contentParser } from 'fastify-file-interceptor';
import { FileHelpers } from 'nextalys-node-helpers';
import { AppDirectories } from '../shared/shared-constants';
import { ExpiredTokenExceptionFilter } from './services/guards/expired-token-filter';
import { GlobalExceptionFilter } from './services/tools/global-exception-filter';
import { AngularNotFoundExceptionFilter } from './services/tools/not-found-filter';
import { ParseRequestPipe } from './services/tools/parse-request.pipe';
import { RedisIoAdapter } from './sockets/redis-io-adapter';
// import { NotFoundDevApiExceptionFilter } from './services/tools/not-found-dev-api-filter';
import fastifyAccepts from '@fastify/accepts';
import { AppData } from './environment/app-data';
import { maintenanceMode } from './environment/constants';
import { MaintenanceInterceptor } from './services/tools/maintenance-interceptor';

async function bootstrap() {
    const fastifyAdapter = new FastifyAdapter({
        logger: false,
        bodyLimit: 10485760,
    }); //10 MB max body
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        fastifyAdapter,
    );
    AppData.currentNestApp = app;
    app.register(fastifyCookie, {
        // secret: "my-secret", // for cookies signature
        // hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
        // parseOptions: {}  // options for parsing cookies
    });

    app.register(fastifyAccepts);

    app.register(contentParser as any);
    // app.use(cookieParser());

    // app.use(bodyParser.json({ limit: '50mb' }));
    // app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.setGlobalPrefix('api');

    // Security headers and origin validation
    app.getHttpAdapter().getInstance().addHook('onRequest', (request, reply, done) => {
        reply.header('X-Content-Type-Options', 'nosniff');
        reply.header('X-Frame-Options', 'DENY');
        reply.header('X-XSS-Protection', '1; mode=block');
        reply.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        
        // Block requests from unauthorized origins in production
        if (Environment.EnvName === 'production') {
            const origin = request.headers.origin || request.headers.referer;
            const allowedOrigins = [
                'https://login.morganmallet.agency',
                'https://morganmallet.agency',
            ];
            
            if (origin && !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
                reply.code(403).send({ message: 'Access denied' });
                return;
            }
        }
        
        done();
    });

    // Enable CORS for production
    if (Environment.EnvName === 'production') {
        app.enableCors({
            origin: [Environment.BaseURL],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        });
    }

    if (Environment.EnvName === 'development') {
        console.log('DEV Mode');
        app.enableCors({
            origin: ['http://localhost:4243'],
            credentials: true,
        });
        const options = new DocumentBuilder()
            .setTitle('Morgan And Mallet CRM')
            .setDescription('Morgan And Mallet CRM API')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const swaggerDoc = SwaggerModule.createDocument(app, options);
        fastifyAdapter.get(
            '/api/docs/swagger.json',
            (req: FastifyRequest, res: FastifyReply) => {
                res.send(swaggerDoc);
            },
        );
        SwaggerModule.setup('swagger', app, swaggerDoc, {
            swaggerUrl: `/api/docs/swagger.json`,
            explorer: true,
            swaggerOptions: {
                docExpansion: 'list',
                filter: true,
                showRequestDuration: true,
            },
        });
        // {
        //   swaggerUrl: `/api/docs/swagger.json`,
        //   explorer: true,
        //   swaggerOptions: {
        //     docExpansion: 'list',
        //     filter: true,
        //     showRequestDuration: true,
        //   },
        // }
    }

    // console.log("Log ~ file: main.ts:70 ~ bootstrap ~ uploadsFolderPath", uploadsFolderPath);
    // app.use('/' + AppDirectories.Uploads, express.static(uploadsFolderPath));
    // app.useStaticAssets({ root: uploadsFolderPath, prefix: '/' + AppDirectories.Uploads });

    const globalFilters: ExceptionFilter[] = [
        new GlobalExceptionFilter(),
        new ExpiredTokenExceptionFilter(),
    ];
    const browserFolder = path.join(process.cwd(), 'browser');
    let decorateReplyAdded = false;
    // console.log("Log ~ file: main.ts:76 ~ bootstrap ~ browserFolder", browserFolder);
    if (
        !Environment.SsrEnabled &&
        (await FileHelpers.fileExists(browserFolder))
    ) {
        const indexHtmlFileName = 'index.html';
        const indexHtmlFile = path.join(browserFolder, indexHtmlFileName);
        // app.useStaticAssets({ root: browserFolder, decorateReply: false });
        // app.useStaticAssets({ root: '/', decorateReply: false });
        app.register(fastifyStatic, {
            root: browserFolder,
            decorateReply: true,
        });
        decorateReplyAdded = true;
        // app.useStaticAssets(browserFolder);
        // app.use('/', express.static(indexHtmlFile));
        // await app.register(require('@fastify/static'), {
        //   root: '/',
        //   // prefix: '/client/', // optional: default '/'
        // });
        globalFilters.push(new AngularNotFoundExceptionFilter(indexHtmlFile));
    } else if (Environment.EnvName === 'development') {
        // globalFilters.push(new NotFoundDevApiExceptionFilter());
    }

    const uploadsFolderPath = path.join(
        Environment.ApiBasePath,
        AppDirectories.Uploads,
        Environment.PublicUploadsDirectoryName,
    );
    app.register(fastifyStatic, {
        root: uploadsFolderPath,
        prefix: '/' + AppDirectories.Uploads,
        decorateReply: !decorateReplyAdded,
    });

    if (Environment.UseRedisWebSocketAdapter) {
        app.useWebSocketAdapter(new RedisIoAdapter(app));
    }
    app.useGlobalPipes(new ParseRequestPipe());
    app.useGlobalFilters(...globalFilters);

    if (maintenanceMode) {
        app.useGlobalInterceptors(new MaintenanceInterceptor());
    }
    const appServer = await app.listen(Environment.ApiPort);
    appServer.setTimeout(400000000); // 600,000=> 10Min, 1200,000=>20Min, 1800,000=>30Min
}
bootstrap().catch((err) => console.error(err));

if (Environment.EnvName === 'development') {
    function shutdown(signal) {
        return (err) => {
            console.log(signal, err);
            if (err) console.error(err.stack || err);
            console.log('...waited 5s, exiting.');
            process.exit(err ? 1 : 0);
        };
    }
    process
        .on('SIGTERM', shutdown('SIGTERM'))
        .on('SIGINT', shutdown('SIGINT'))
        .on('uncaughtException', shutdown('uncaughtException'));
}
