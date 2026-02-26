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
exports.currentJobsCandidateIdNullable1656407327093 = void 0;
class currentJobsCandidateIdNullable1656407327093 {
    constructor() {
        this.name = 'currentJobsCandidateIdNullable1656407327093';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` DROP FOREIGN KEY \`FK_bada2f86ae56a99fd741c49d905\``);
                yield queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` DROP FOREIGN KEY \`FK_d3f86ed0cd3ef06c21b2f47bb94\``);
            }
            catch (error) {
            }
            yield queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` CHANGE \`candidateId\` \`candidateId\` varchar(36) NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` ADD CONSTRAINT \`FK_bada2f86ae56a99fd741c49d905\` FOREIGN KEY (\`candidateId\`) REFERENCES \`candidates\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` ADD CONSTRAINT \`FK_d3f86ed0cd3ef06c21b2f47bb94\` FOREIGN KEY (\`currentJobId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` DROP FOREIGN KEY \`FK_d3f86ed0cd3ef06c21b2f47bb94\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` DROP FOREIGN KEY \`FK_bada2f86ae56a99fd741c49d905\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` CHANGE \`candidateId\` \`candidateId\` varchar(36) NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` ADD CONSTRAINT \`FK_d3f86ed0cd3ef06c21b2f47bb94\` FOREIGN KEY (\`currentJobId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` ADD CONSTRAINT \`FK_bada2f86ae56a99fd741c49d905\` FOREIGN KEY (\`candidateId\`) REFERENCES \`candidates\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        });
    }
}
exports.currentJobsCandidateIdNullable1656407327093 = currentJobsCandidateIdNullable1656407327093;
//# sourceMappingURL=1656407327093-current-jobs-candidate-id-nullable.js.map