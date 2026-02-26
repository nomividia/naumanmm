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
exports.candidateJobType1759843626515 = void 0;
class candidateJobType1759843626515 {
    constructor() {
        this.name = 'candidateJobType1759843626515';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` ADD \`type\` enum ('JOB', 'EDUCATION') NOT NULL DEFAULT 'JOB'`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` DROP COLUMN \`type\``);
        });
    }
}
exports.candidateJobType1759843626515 = candidateJobType1759843626515;
//# sourceMappingURL=1759843626515-candidate-job-type.js.map