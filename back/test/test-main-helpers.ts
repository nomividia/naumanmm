import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../app.module';
export class TestMainHelpers {
    static app: INestApplication;
    static module: TestingModule;

    static async initTestingModule() {
        if (this.app) return this.app;
        this.module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        this.app = this.module.createNestApplication();
        await this.app.init();
        return this.app;
    }

    static sendRequest() {
        return request(this.app.getHttpServer());
    }
}
