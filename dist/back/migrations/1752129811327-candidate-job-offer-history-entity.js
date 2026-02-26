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
exports.candidateJobOfferHistoryEntity1752129811327 = void 0;
class candidateJobOfferHistoryEntity1752129811327 {
    constructor() {
        this.name = 'candidateJobOfferHistoryEntity1752129811327';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP INDEX \`idx_status_disabled_creation\` ON \`candidate-applications\``);
            yield queryRunner.query(`CREATE TABLE \`candidate-job-offer-history\` (\`id\` varchar(36) NOT NULL, \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`disabled\` tinyint NOT NULL DEFAULT '0', \`candidateId\` varchar(36) NOT NULL, \`jobOfferId\` varchar(36) NOT NULL, \`action\` enum ('LINKED', 'UNLINKED') NOT NULL, \`candidateFirstName\` varchar(130) NULL, \`candidateLastName\` varchar(130) NULL, \`actionDate\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`ALTER TABLE \`candidates\` ADD CONSTRAINT \`FK_f3f436e97b1b0da1a21261e9db9\` FOREIGN KEY (\`placedJobOfferId\`) REFERENCES \`job-offers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`candidate-job-offer-history\` ADD CONSTRAINT \`FK_37da5dc7adcc25e6f7b1993543d\` FOREIGN KEY (\`candidateId\`) REFERENCES \`candidates\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`candidate-job-offer-history\` ADD CONSTRAINT \`FK_6ebf44dc628570ffe4aa08200d6\` FOREIGN KEY (\`jobOfferId\`) REFERENCES \`job-offers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-job-offer-history\` DROP FOREIGN KEY \`FK_6ebf44dc628570ffe4aa08200d6\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-job-offer-history\` DROP FOREIGN KEY \`FK_37da5dc7adcc25e6f7b1993543d\``);
            yield queryRunner.query(`ALTER TABLE \`candidates\` DROP FOREIGN KEY \`FK_f3f436e97b1b0da1a21261e9db9\``);
            yield queryRunner.query(`DROP TABLE \`candidate-job-offer-history\``);
            yield queryRunner.query(`CREATE INDEX \`idx_status_disabled_creation\` ON \`candidate-applications\` (\`applyStatusId\`, \`disabled\`, \`creationDate\`)`);
        });
    }
}
exports.candidateJobOfferHistoryEntity1752129811327 = candidateJobOfferHistoryEntity1752129811327;
//# sourceMappingURL=1752129811327-candidate-job-offer-history-entity.js.map