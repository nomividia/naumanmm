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
exports.countryCandidateApplication1675334981900 = void 0;
class countryCandidateApplication1675334981900 {
    constructor() {
        this.name = 'countryCandidateApplication1675334981900';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-country\` ADD \`candidateApplicationId\` varchar(36) NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidate-country\` ADD CONSTRAINT \`FK_850835f94d608e5aa3a5b9e4aef\` FOREIGN KEY (\`candidateApplicationId\`) REFERENCES \`candidate-applications\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-country\` DROP FOREIGN KEY \`FK_850835f94d608e5aa3a5b9e4aef\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-country\` DROP COLUMN \`candidateApplicationId\``);
        });
    }
}
exports.countryCandidateApplication1675334981900 = countryCandidateApplication1675334981900;
//# sourceMappingURL=1675334981900-country-candidate-application.js.map