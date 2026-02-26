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
exports.candidateApplicationEmailPhonePartner1674741260139 = void 0;
class candidateApplicationEmailPhonePartner1674741260139 {
    constructor() {
        this.name = 'candidateApplicationEmailPhonePartner1674741260139';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-applications\` ADD \`partnerEmail\` varchar(255) NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidate-applications\` ADD \`partnerPhone\` varchar(255) NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-applications\` DROP COLUMN \`partnerPhone\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-applications\` DROP COLUMN \`partnerEmail\``);
        });
    }
}
exports.candidateApplicationEmailPhonePartner1674741260139 = candidateApplicationEmailPhonePartner1674741260139;
//# sourceMappingURL=1674741260139-candidate-application-email-phone-partner.js.map