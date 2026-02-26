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
exports.candidateWorkUsFields1726044581349 = void 0;
class candidateWorkUsFields1726044581349 {
    constructor() {
        this.name = 'candidateWorkUsFields1726044581349';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-applications\` ADD \`allowed_to_work_us\` tinyint NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidate-applications\` ADD \`require_sponsorship_us\` tinyint NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidates\` ADD \`allowed_to_work_us\` tinyint NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidates\` ADD \`require_sponsorship_us\` tinyint NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`require_sponsorship_us\``);
            yield queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`allowed_to_work_us\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-applications\` DROP COLUMN \`require_sponsorship_us\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-applications\` DROP COLUMN \`allowed_to_work_us\``);
        });
    }
}
exports.candidateWorkUsFields1726044581349 = candidateWorkUsFields1726044581349;
//# sourceMappingURL=1726044581349-candidate-work-us-fields.js.map