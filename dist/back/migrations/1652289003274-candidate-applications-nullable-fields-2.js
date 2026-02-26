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
exports.candidateApplicationsNullableFields21652289003274 = void 0;
class candidateApplicationsNullableFields21652289003274 {
    constructor() {
        this.name = 'candidateApplicationsNullableFields21652289003274';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("ALTER TABLE `candidate-applications` CHANGE `email` `email` varchar(255) NULL");
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("ALTER TABLE `candidate-applications` CHANGE `email` `email` varchar(255) NOT NULL");
        });
    }
}
exports.candidateApplicationsNullableFields21652289003274 = candidateApplicationsNullableFields21652289003274;
//# sourceMappingURL=1652289003274-candidate-applications-nullable-fields-2.js.map