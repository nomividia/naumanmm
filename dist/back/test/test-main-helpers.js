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
exports.TestMainHelpers = void 0;
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("./../app.module");
class TestMainHelpers {
    static initTestingModule() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.app)
                return this.app;
            this.module = yield testing_1.Test.createTestingModule({
                imports: [app_module_1.AppModule],
            }).compile();
            this.app = this.module.createNestApplication();
            yield this.app.init();
            return this.app;
        });
    }
    static sendRequest() {
        return request(this.app.getHttpServer());
    }
}
exports.TestMainHelpers = TestMainHelpers;
//# sourceMappingURL=test-main-helpers.js.map