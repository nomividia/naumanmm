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
exports.historyEntityFieldsLength1662451271712 = void 0;
class historyEntityFieldsLength1662451271712 {
    constructor() {
        this.name = 'historyEntityFieldsLength1662451271712';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`history\` DROP COLUMN \`entityId\``);
            yield queryRunner.query(`ALTER TABLE \`history\` ADD \`entityId\` varchar(36) NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`history\` DROP COLUMN \`valueBefore\``);
            yield queryRunner.query(`ALTER TABLE \`history\` ADD \`valueBefore\` text NULL`);
            yield queryRunner.query(`ALTER TABLE \`history\` DROP COLUMN \`valueAfter\``);
            yield queryRunner.query(`ALTER TABLE \`history\` ADD \`valueAfter\` text NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`history\` DROP COLUMN \`valueAfter\``);
            yield queryRunner.query(`ALTER TABLE \`history\` ADD \`valueAfter\` varchar(100) NULL`);
            yield queryRunner.query(`ALTER TABLE \`history\` DROP COLUMN \`valueBefore\``);
            yield queryRunner.query(`ALTER TABLE \`history\` ADD \`valueBefore\` varchar(100) NULL`);
            yield queryRunner.query(`ALTER TABLE \`history\` DROP COLUMN \`entityId\``);
            yield queryRunner.query(`ALTER TABLE \`history\` ADD \`entityId\` varchar(255) NOT NULL`);
        });
    }
}
exports.historyEntityFieldsLength1662451271712 = historyEntityFieldsLength1662451271712;
//# sourceMappingURL=1662451271712-history-entity-fields-length.js.map