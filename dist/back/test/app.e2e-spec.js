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
const referential_service_1 = require("../services/referential.service");
const test_main_helpers_1 = require("./test-main-helpers");
const test_types_1 = require("./test-types");
describe('AppController (e2e)', () => {
    let referentialService;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield test_main_helpers_1.TestMainHelpers.initTestingModule();
        referentialService =
            test_main_helpers_1.TestMainHelpers.module.get(referential_service_1.ReferentialService);
    }));
    it('test', () => {
        expect(true).toBeTruthy();
    });
    it('get app values', () => __awaiter(void 0, void 0, void 0, function* () {
        return;
        const response = yield referentialService.getAllAppValues();
        console.log('Log ~ file: app.e2e-spec.ts ~ line 24 ~ it ~ response', response);
        expect(response.success).toBeTruthy();
    }));
    it('List tests', () => {
        let pTempNoeud;
        const pLNoeudsVirtuels = new test_types_1.NxsList();
        pTempNoeud = pLNoeudsVirtuels.ElementAtOrDefault(0);
        expect(pTempNoeud).toBeUndefined();
        pLNoeudsVirtuels.Add(new test_types_1.stNoeud());
        pTempNoeud = pLNoeudsVirtuels.ElementAtOrDefault(0);
        expect(pTempNoeud).toBeTruthy();
    });
});
//# sourceMappingURL=app.e2e-spec.js.map