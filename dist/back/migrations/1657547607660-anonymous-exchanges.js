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
exports.anonymousExchanges1657547607660 = void 0;
class anonymousExchanges1657547607660 {
    constructor() {
        this.name = 'anonymousExchanges1657547607660';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`anonymous-exchanges\` (\`id\` varchar(36) NOT NULL, \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`disabled\` tinyint NOT NULL DEFAULT '0', \`candidateApplicationId\` varchar(36) NOT NULL, \`messageContent\` text NOT NULL, \`consultantId\` varchar(36) NULL, \`seen\` tinyint NOT NULL DEFAULT '0', \`senderType\` enum ('consultant', 'guest') NOT NULL, \`fileId\` varchar(36) NULL, UNIQUE INDEX \`REL_fa2fdcb51bfbbb21d5d114ed3d\` (\`fileId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`ALTER TABLE \`anonymous-exchanges\` ADD CONSTRAINT \`FK_2ac5684d4b792aa0343a1f1ca8c\` FOREIGN KEY (\`candidateApplicationId\`) REFERENCES \`candidate-applications\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`anonymous-exchanges\` ADD CONSTRAINT \`FK_3ee1b76dfb8c2b6c61531319f5b\` FOREIGN KEY (\`consultantId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`anonymous-exchanges\` ADD CONSTRAINT \`FK_fa2fdcb51bfbbb21d5d114ed3dc\` FOREIGN KEY (\`fileId\`) REFERENCES \`app_files\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`anonymous-exchanges\` DROP FOREIGN KEY \`FK_fa2fdcb51bfbbb21d5d114ed3dc\``);
            yield queryRunner.query(`ALTER TABLE \`anonymous-exchanges\` DROP FOREIGN KEY \`FK_3ee1b76dfb8c2b6c61531319f5b\``);
            yield queryRunner.query(`ALTER TABLE \`anonymous-exchanges\` DROP FOREIGN KEY \`FK_2ac5684d4b792aa0343a1f1ca8c\``);
            yield queryRunner.query(`DROP INDEX \`REL_fa2fdcb51bfbbb21d5d114ed3d\` ON \`anonymous-exchanges\``);
            yield queryRunner.query(`DROP TABLE \`anonymous-exchanges\``);
        });
    }
}
exports.anonymousExchanges1657547607660 = anonymousExchanges1657547607660;
//# sourceMappingURL=1657547607660-anonymous-exchanges.js.map