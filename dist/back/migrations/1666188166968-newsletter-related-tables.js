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
exports.newsletterRelatedTables1666188166968 = void 0;
class newsletterRelatedTables1666188166968 {
    constructor() {
        this.name = 'newsletterRelatedTables1666188166968';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` DROP FOREIGN KEY \`FK_ebeef19b3e23e9fc71fa20452d8\``);
            }
            catch (error) {
                console.log("error migration", error);
            }
            try {
                yield queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` DROP FOREIGN KEY \`FK_87c35e523dd0effe1e75b25fcb0\``);
            }
            catch (error) {
                console.log("error migration", error);
            }
            try {
                yield queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` DROP FOREIGN KEY \`FK_9c1128a1b1d840490585e8047b4\``);
            }
            catch (error) {
                console.log("error migration", error);
            }
            try {
                yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` DROP FOREIGN KEY \`FK_2e35ee9860df4fcc795934b774a\``);
            }
            catch (error) {
                console.log("error migration", error);
            }
            try {
                yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` DROP FOREIGN KEY \`FK_233c9e4f97bbc54b603d9e5a4d0\``);
            }
            catch (error) {
                console.log("error migration", error);
            }
            try {
                yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` DROP FOREIGN KEY \`FK_ff9bb4dddff022f78f526bd6cf0\``);
            }
            catch (error) {
                console.log("error migration", error);
            }
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` CHANGE \`jobTypeId\` \`jobTypeId\` varchar(36) NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` CHANGE \`newsLetterId\` \`newsLetterId\` varchar(36) NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` CHANGE \`jobOfferId\` \`jobOfferId\` varchar(36) NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` CHANGE \`newsletterId\` \`newsletterId\` varchar(36) NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` CHANGE \`candidateStatusId\` \`candidateStatusId\` varchar(36) NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` CHANGE \`newsletterId\` \`newsletterId\` varchar(36) NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` ADD CONSTRAINT \`FK_ebeef19b3e23e9fc71fa20452d8\` FOREIGN KEY (\`jobTypeId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` ADD CONSTRAINT \`FK_233c9e4f97bbc54b603d9e5a4d0\` FOREIGN KEY (\`newsLetterId\`) REFERENCES \`newsletter\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` ADD CONSTRAINT \`FK_87c35e523dd0effe1e75b25fcb0\` FOREIGN KEY (\`jobOfferId\`) REFERENCES \`job-offers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` ADD CONSTRAINT \`FK_9c1128a1b1d840490585e8047b4\` FOREIGN KEY (\`newsletterId\`) REFERENCES \`newsletter\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` ADD CONSTRAINT \`FK_2e35ee9860df4fcc795934b774a\` FOREIGN KEY (\`candidateStatusId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` ADD CONSTRAINT \`FK_ff9bb4dddff022f78f526bd6cf0\` FOREIGN KEY (\`newsletterId\`) REFERENCES \`newsletter\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` DROP FOREIGN KEY \`FK_ff9bb4dddff022f78f526bd6cf0\``);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` DROP FOREIGN KEY \`FK_2e35ee9860df4fcc795934b774a\``);
            yield queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` DROP FOREIGN KEY \`FK_9c1128a1b1d840490585e8047b4\``);
            yield queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` DROP FOREIGN KEY \`FK_87c35e523dd0effe1e75b25fcb0\``);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` DROP FOREIGN KEY \`FK_233c9e4f97bbc54b603d9e5a4d0\``);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` DROP FOREIGN KEY \`FK_ebeef19b3e23e9fc71fa20452d8\``);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` CHANGE \`newsletterId\` \`newsletterId\` varchar(36) NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` CHANGE \`candidateStatusId\` \`candidateStatusId\` varchar(36) NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` ADD CONSTRAINT \`FK_ff9bb4dddff022f78f526bd6cf0\` FOREIGN KEY (\`newsletterId\`) REFERENCES \`newsletter\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` CHANGE \`newsletterId\` \`newsletterId\` varchar(36) NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` CHANGE \`jobOfferId\` \`jobOfferId\` varchar(36) NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` CHANGE \`newsLetterId\` \`newsLetterId\` varchar(36) NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` CHANGE \`jobTypeId\` \`jobTypeId\` varchar(36) NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` ADD CONSTRAINT \`FK_233c9e4f97bbc54b603d9e5a4d0\` FOREIGN KEY (\`newsLetterId\`) REFERENCES \`newsletter\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` ADD CONSTRAINT \`FK_2e35ee9860df4fcc795934b774a\` FOREIGN KEY (\`candidateStatusId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` ADD CONSTRAINT \`FK_9c1128a1b1d840490585e8047b4\` FOREIGN KEY (\`newsletterId\`) REFERENCES \`newsletter\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` ADD CONSTRAINT \`FK_87c35e523dd0effe1e75b25fcb0\` FOREIGN KEY (\`jobOfferId\`) REFERENCES \`job-offers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` ADD CONSTRAINT \`FK_ebeef19b3e23e9fc71fa20452d8\` FOREIGN KEY (\`jobTypeId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
}
exports.newsletterRelatedTables1666188166968 = newsletterRelatedTables1666188166968;
//# sourceMappingURL=1666188166968-newsletter-related-tables.js.map