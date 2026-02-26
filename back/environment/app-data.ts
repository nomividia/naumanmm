import { NestFastifyApplication } from '@nestjs/platform-fastify';

export class AppData {
    static currentNestApp: NestFastifyApplication;
}
