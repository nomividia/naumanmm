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
exports.candidateApplicationUnsubscribe1672906632415 = void 0;
class candidateApplicationUnsubscribe1672906632415 {
    constructor() {
        this.name = 'candidateApplicationUnsubscribe1672906632415';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-applications\` ADD \`newsletterUnsubscribed\` tinyint NOT NULL DEFAULT '0'`);
            yield queryRunner.query(`ALTER TABLE \`candidate-applications\` ADD \`newsletterUnsubscribedGuid\` varchar(36) NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-applications\` DROP COLUMN \`newsletterUnsubscribedGuid\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-applications\` DROP COLUMN \`newsletterUnsubscribed\``);
        });
    }
}
exports.candidateApplicationUnsubscribe1672906632415 = candidateApplicationUnsubscribe1672906632415;
//# sourceMappingURL=1672906632415-candidate-application-unsubscribe.js.map