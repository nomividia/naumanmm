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
exports.newsletterCandidatesDepartments1709722571849 = void 0;
class newsletterCandidatesDepartments1709722571849 {
    constructor() {
        this.name = 'newsletterCandidatesDepartments1709722571849';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-department\` ADD \`newsletterId\` varchar(36) NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidate-department\` ADD CONSTRAINT \`FK_1da1e5ebc2b910978d7f7306a07\` FOREIGN KEY (\`newsletterId\`) REFERENCES \`newsletter\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-department\` DROP FOREIGN KEY \`FK_1da1e5ebc2b910978d7f7306a07\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-department\` DROP COLUMN \`newsletterId\``);
        });
    }
}
exports.newsletterCandidatesDepartments1709722571849 = newsletterCandidatesDepartments1709722571849;
//# sourceMappingURL=1709722571849-newsletter-candidates-departments.js.map