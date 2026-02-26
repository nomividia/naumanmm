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
exports.candidateExperienceCurrentlyInPosition1708339031743 = void 0;
class candidateExperienceCurrentlyInPosition1708339031743 {
    constructor() {
        this.name = 'candidateExperienceCurrentlyInPosition1708339031743';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` ADD \`currentlyInPosition\` tinyint NOT NULL DEFAULT '0'`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` DROP COLUMN \`currentlyInPosition\``);
        });
    }
}
exports.candidateExperienceCurrentlyInPosition1708339031743 = candidateExperienceCurrentlyInPosition1708339031743;
//# sourceMappingURL=1708339031743-candidate-experience-currently-in-position.js.map