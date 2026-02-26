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
exports.addPlacementFieldsToHistory1770818043780 = void 0;
class addPlacementFieldsToHistory1770818043780 {
    constructor() {
        this.name = 'addPlacementFieldsToHistory1770818043780';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const startDateExists = yield queryRunner.query(`SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'candidate-job-offer-history' AND COLUMN_NAME = 'startDate'`);
            if (startDateExists[0].cnt === 0) {
                yield queryRunner.query(`ALTER TABLE \`candidate-job-offer-history\` ADD \`startDate\` date NULL`);
            }
            const contractFileIdExists = yield queryRunner.query(`SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'candidate-job-offer-history' AND COLUMN_NAME = 'contractFileId'`);
            if (contractFileIdExists[0].cnt === 0) {
                yield queryRunner.query(`ALTER TABLE \`candidate-job-offer-history\` ADD \`contractFileId\` varchar(36) NULL`);
            }
            const fkExists = yield queryRunner.query(`SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'candidate-job-offer-history' AND CONSTRAINT_NAME = 'FK_placement_contract_file'`);
            if (fkExists[0].cnt === 0) {
                yield queryRunner.query(`ALTER TABLE \`candidate-job-offer-history\` ADD CONSTRAINT \`FK_placement_contract_file\` FOREIGN KEY (\`contractFileId\`) REFERENCES \`candidates-files\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
            }
            const appValueExists = yield queryRunner.query(`SELECT COUNT(*) as cnt FROM \`app_values\` WHERE \`code\` = 'CandidateFileType_PlacementContract'`);
            if (appValueExists[0].cnt === 0) {
                const [existingType] = yield queryRunner.query(`SELECT \`appTypeId\` FROM \`app_values\` WHERE \`code\` LIKE 'CandidateFileType_%' LIMIT 1`);
                const appTypeId = existingType === null || existingType === void 0 ? void 0 : existingType.appTypeId;
                if (appTypeId) {
                    yield queryRunner.query(`INSERT INTO \`app_values\` (\`id\`, \`label\`, \`enabled\`, \`code\`, \`appTypeId\`, \`order\`) VALUES (UUID(), 'Placement Contract', 1, 'CandidateFileType_PlacementContract', '${appTypeId}', 99)`);
                }
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DELETE FROM \`app_values\` WHERE \`code\` = 'CandidateFileType_PlacementContract'`);
            yield queryRunner.query(`ALTER TABLE \`candidate-job-offer-history\` DROP FOREIGN KEY \`FK_placement_contract_file\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-job-offer-history\` DROP COLUMN \`contractFileId\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-job-offer-history\` DROP COLUMN \`startDate\``);
        });
    }
}
exports.addPlacementFieldsToHistory1770818043780 = addPlacementFieldsToHistory1770818043780;
//# sourceMappingURL=1770818043780-add-placement-fields-to-history.js.map