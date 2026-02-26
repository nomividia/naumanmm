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
exports.candidatePresentation1761892157298 = void 0;
class candidatePresentation1761892157298 {
    constructor() {
        this.name = 'candidatePresentation1761892157298';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`candidate_presentations\` (\`id\` varchar(36) NOT NULL, \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`disabled\` tinyint NOT NULL DEFAULT '0', \`title\` varchar(255) NOT NULL, \`content\` text NULL, \`candidateId\` varchar(36) NOT NULL, \`isDefault\` tinyint NOT NULL DEFAULT 0, \`displayOrder\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`ALTER TABLE \`candidate_presentations\` ADD CONSTRAINT \`FK_2f9fa22aee02bf6af54849fca6c\` FOREIGN KEY (\`candidateId\`) REFERENCES \`candidates\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate_presentations\` DROP FOREIGN KEY \`FK_2f9fa22aee02bf6af54849fca6c\``);
            yield queryRunner.query(`DROP TABLE \`candidate_presentations\``);
        });
    }
}
exports.candidatePresentation1761892157298 = candidatePresentation1761892157298;
//# sourceMappingURL=1761892157298-candidate-presentation.js.map