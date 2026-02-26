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
exports.candidateCurrentJob1655890817370 = void 0;
class candidateCurrentJob1655890817370 {
    constructor() {
        this.name = 'candidateCurrentJob1655890817370';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`candidate-current-jobs\` (\`id\` varchar(36) NOT NULL, \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`disabled\` tinyint NOT NULL DEFAULT '0', \`candidateId\` varchar(36) NULL, \`currentJobId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` ADD CONSTRAINT \`FK_bada2f86ae56a99fd741c49d905\` FOREIGN KEY (\`candidateId\`) REFERENCES \`candidates\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` ADD CONSTRAINT \`FK_d3f86ed0cd3ef06c21b2f47bb94\` FOREIGN KEY (\`currentJobId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` DROP FOREIGN KEY \`FK_d3f86ed0cd3ef06c21b2f47bb94\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` DROP FOREIGN KEY \`FK_bada2f86ae56a99fd741c49d905\``);
            yield queryRunner.query(`DROP TABLE \`candidate-current-jobs\``);
        });
    }
}
exports.candidateCurrentJob1655890817370 = candidateCurrentJob1655890817370;
//# sourceMappingURL=1655890817370-candidate-current-job.js.map