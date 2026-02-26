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
exports.candidateResumeExperienceLocation1656423189397 = void 0;
class candidateResumeExperienceLocation1656423189397 {
    constructor() {
        this.name = 'candidateResumeExperienceLocation1656423189397';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` ADD \`city\` varchar(150) NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` ADD \`country\` varchar(100) NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` DROP COLUMN \`country\``);
            yield queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` DROP COLUMN \`city\``);
        });
    }
}
exports.candidateResumeExperienceLocation1656423189397 = candidateResumeExperienceLocation1656423189397;
//# sourceMappingURL=1656423189397-candidate-resume-experience-location.js.map