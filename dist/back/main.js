"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const path = require("path");
const environment_1 = require("./environment/environment");
const cookie_1 = require("@fastify/cookie");
const fastifyStatic = require("@fastify/static");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const fastify_file_interceptor_1 = require("fastify-file-interceptor");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const shared_constants_1 = require("../shared/shared-constants");
const expired_token_filter_1 = require("./services/guards/expired-token-filter");
const global_exception_filter_1 = require("./services/tools/global-exception-filter");
const not_found_filter_1 = require("./services/tools/not-found-filter");
const parse_request_pipe_1 = require("./services/tools/parse-request.pipe");
const redis_io_adapter_1 = require("./sockets/redis-io-adapter");
const accepts_1 = require("@fastify/accepts");
const app_data_1 = require("./environment/app-data");
const constants_1 = require("./environment/constants");
const maintenance_interceptor_1 = require("./services/tools/maintenance-interceptor");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const fastifyAdapter = new platform_fastify_1.FastifyAdapter({
            logger: false,
            bodyLimit: 10485760,
        });
        const app = yield core_1.NestFactory.create(app_module_1.AppModule, fastifyAdapter);
        app_data_1.AppData.currentNestApp = app;
        app.register(cookie_1.default, {});
        app.register(accepts_1.default);
        app.register(fastify_file_interceptor_1.contentParser);
        app.setGlobalPrefix('api');
        app.getHttpAdapter().getInstance().addHook('onRequest', (request, reply, done) => {
            reply.header('X-Content-Type-Options', 'nosniff');
            reply.header('X-Frame-Options', 'DENY');
            reply.header('X-XSS-Protection', '1; mode=block');
            reply.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            if (environment_1.Environment.EnvName === 'production') {
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
        if (environment_1.Environment.EnvName === 'production') {
            app.enableCors({
                origin: [environment_1.Environment.BaseURL],
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
                allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
            });
        }
        if (environment_1.Environment.EnvName === 'development') {
            console.log('DEV Mode');
            app.enableCors({
                origin: ['http://localhost:4243'],
                credentials: true,
            });
            const options = new swagger_1.DocumentBuilder()
                .setTitle('Morgan And Mallet CRM')
                .setDescription('Morgan And Mallet CRM API')
                .setVersion('1.0')
                .addBearerAuth()
                .build();
            const swaggerDoc = swagger_1.SwaggerModule.createDocument(app, options);
            fastifyAdapter.get('/api/docs/swagger.json', (req, res) => {
                res.send(swaggerDoc);
            });
            swagger_1.SwaggerModule.setup('swagger', app, swaggerDoc, {
                swaggerUrl: `/api/docs/swagger.json`,
                explorer: true,
                swaggerOptions: {
                    docExpansion: 'list',
                    filter: true,
                    showRequestDuration: true,
                },
            });
        }
        const globalFilters = [
            new global_exception_filter_1.GlobalExceptionFilter(),
            new expired_token_filter_1.ExpiredTokenExceptionFilter(),
        ];
        const browserFolder = path.join(process.cwd(), 'browser');
        let decorateReplyAdded = false;
        if (!environment_1.Environment.SsrEnabled &&
            (yield nextalys_node_helpers_1.FileHelpers.fileExists(browserFolder))) {
            const indexHtmlFileName = 'index.html';
            const indexHtmlFile = path.join(browserFolder, indexHtmlFileName);
            app.register(fastifyStatic, {
                root: browserFolder,
                decorateReply: true,
            });
            decorateReplyAdded = true;
            globalFilters.push(new not_found_filter_1.AngularNotFoundExceptionFilter(indexHtmlFile));
        }
        else if (environment_1.Environment.EnvName === 'development') {
        }
        const uploadsFolderPath = path.join(environment_1.Environment.ApiBasePath, shared_constants_1.AppDirectories.Uploads, environment_1.Environment.PublicUploadsDirectoryName);
        app.register(fastifyStatic, {
            root: uploadsFolderPath,
            prefix: '/' + shared_constants_1.AppDirectories.Uploads,
            decorateReply: !decorateReplyAdded,
        });
        if (environment_1.Environment.UseRedisWebSocketAdapter) {
            app.useWebSocketAdapter(new redis_io_adapter_1.RedisIoAdapter(app));
        }
        app.useGlobalPipes(new parse_request_pipe_1.ParseRequestPipe());
        app.useGlobalFilters(...globalFilters);
        if (constants_1.maintenanceMode) {
            app.useGlobalInterceptors(new maintenance_interceptor_1.MaintenanceInterceptor());
        }
        const appServer = yield app.listen(environment_1.Environment.ApiPort);
        appServer.setTimeout(400000000);
    });
}
bootstrap().catch((err) => console.error(err));
if (environment_1.Environment.EnvName === 'development') {
    function shutdown(signal) {
        return (err) => {
            console.log(signal, err);
            if (err)
                console.error(err.stack || err);
            console.log('...waited 5s, exiting.');
            process.exit(err ? 1 : 0);
        };
    }
    process
        .on('SIGTERM', shutdown('SIGTERM'))
        .on('SIGINT', shutdown('SIGINT'))
        .on('uncaughtException', shutdown('uncaughtException'));
}
//# sourceMappingURL=main.js.map