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
exports.candidateDepartments1673889790114 = void 0;
class candidateDepartments1673889790114 {
    constructor() {
        this.name = 'candidateDepartments1673889790114';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`candidate-department\` (\`id\` varchar(36) NOT NULL, \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`disabled\` tinyint NOT NULL DEFAULT '0', \`candidateId\` varchar(36) NULL, \`candidateApplicationId\` varchar(36) NULL, \`country\` varchar(2) NOT NULL, \`department\` varchar(20) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`ALTER TABLE \`candidate-department\` ADD CONSTRAINT \`FK_6a489e7689a0932a0c488ea0b1b\` FOREIGN KEY (\`candidateId\`) REFERENCES \`candidates\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE \`candidate-department\` ADD CONSTRAINT \`FK_e947cb5b8749beb950c19847136\` FOREIGN KEY (\`candidateApplicationId\`) REFERENCES \`candidate-applications\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-department\` DROP FOREIGN KEY \`FK_e947cb5b8749beb950c19847136\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-department\` DROP FOREIGN KEY \`FK_6a489e7689a0932a0c488ea0b1b\``);
            yield queryRunner.query(`ALTER TABLE \`candidates-resume-formation\` DROP COLUMN \`place\``);
            yield queryRunner.query(`ALTER TABLE \`candidates-resume-formation\` ADD \`place\` text NULL`);
            yield queryRunner.query(`DROP TABLE \`candidate-department\``);
        });
    }
}
exports.candidateDepartments1673889790114 = candidateDepartments1673889790114;
//# sourceMappingURL=1673889790114-candidate-departments.js.map