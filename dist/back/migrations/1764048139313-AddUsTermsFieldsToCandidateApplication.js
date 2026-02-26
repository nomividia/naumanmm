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
exports.AddUsTermsFieldsToCandidateApplication1764048139313 = void 0;
class AddUsTermsFieldsToCandidateApplication1764048139313 {
    constructor() {
        this.name = 'AddUsTermsFieldsToCandidateApplication1764048139313';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-applications\` ADD \`usTermsAcceptedAt\` datetime NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidate-applications\` ADD \`usTermsVersion\` varchar(20) NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-applications\` DROP COLUMN \`usTermsVersion\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-applications\` DROP COLUMN \`usTermsAcceptedAt\``);
        });
    }
}
exports.AddUsTermsFieldsToCandidateApplication1764048139313 = AddUsTermsFieldsToCandidateApplication1764048139313;
//# sourceMappingURL=1764048139313-AddUsTermsFieldsToCandidateApplication.js.map