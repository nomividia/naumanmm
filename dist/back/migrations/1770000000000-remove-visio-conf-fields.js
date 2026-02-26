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
exports.removeVisioConfFields1770000000000 = void 0;
class removeVisioConfFields1770000000000 {
    constructor() {
        this.name = 'removeVisioConfFields1770000000000';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const foreignKeys = yield queryRunner.query(`
            SELECT CONSTRAINT_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'candidates'
              AND COLUMN_NAME = 'visioConfTypeId'
              AND REFERENCED_TABLE_NAME IS NOT NULL
        `);
            for (const fk of foreignKeys) {
                yield queryRunner.query(`ALTER TABLE \`candidates\` DROP FOREIGN KEY \`${fk.CONSTRAINT_NAME}\``);
            }
            yield queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`visioConfTypeId\``);
            yield queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`visioConfUserId\``);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates\` ADD \`visioConfTypeId\` varchar(36) NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidates\` ADD \`visioConfUserId\` varchar(36) NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidates\` ADD CONSTRAINT \`FK_candidates_visioConfTypeId\` FOREIGN KEY (\`visioConfTypeId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
}
exports.removeVisioConfFields1770000000000 = removeVisioConfFields1770000000000;
//# sourceMappingURL=1770000000000-remove-visio-conf-fields.js.map