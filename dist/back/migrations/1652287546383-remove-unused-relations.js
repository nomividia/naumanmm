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
exports.removeUnusedRelations1652287546383 = void 0;
class removeUnusedRelations1652287546383 {
    constructor() {
        this.name = 'removeUnusedRelations1652287546383';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield queryRunner.query("ALTER TABLE `candidate-language` DROP COLUMN `languageCandidateId`");
                yield queryRunner.query("ALTER TABLE `candidates` DROP COLUMN `jobOfferLinked`");
            }
            catch (_a) {
            }
            yield queryRunner.query("ALTER TABLE `candidate-applications` DROP COLUMN `jobOfferLinkedId`");
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("ALTER TABLE `candidate-applications` ADD `jobOfferLinkedId` varchar(36) NULL");
            yield queryRunner.query("ALTER TABLE `candidates` ADD `jobOfferLinked` varchar(255) NULL");
            yield queryRunner.query("ALTER TABLE `candidate-language` ADD `languageCandidateId` varchar(36) NULL");
            yield queryRunner.query("ALTER TABLE `candidate-applications` ADD CONSTRAINT `FK_c4c6d97b6aef933c762eb41a9a3` FOREIGN KEY (`jobOfferLinkedId`) REFERENCES `job-offers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
            yield queryRunner.query("ALTER TABLE `candidate-language` ADD CONSTRAINT `FK_fa07adc7b0c94803028e7fb3843` FOREIGN KEY (`languageCandidateId`) REFERENCES `app_values`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        });
    }
}
exports.removeUnusedRelations1652287546383 = removeUnusedRelations1652287546383;
//# sourceMappingURL=1652287546383-remove-unused-relations.js.map