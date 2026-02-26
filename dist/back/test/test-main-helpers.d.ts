import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
export declare class TestMainHelpers {
    static app: INestApplication;
    static module: TestingModule;
    static initTestingModule(): Promise<INestApplication>;
    static sendRequest(): request.SuperTest<request.Test>;
}
