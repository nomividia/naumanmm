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
exports.updateNewsletterCityFilterToArray1753160165629 = void 0;
class updateNewsletterCityFilterToArray1753160165629 {
    constructor() {
        this.name = 'updateNewsletterCityFilterToArray1753160165629';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`cityFilter_backup\` varchar(255) NULL`);
            yield queryRunner.query(`UPDATE \`newsletter\` SET \`cityFilter_backup\` = \`cityFilter\``);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`cityFilter\``);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`cityFilter\` json NULL`);
            yield queryRunner.query(`
            UPDATE \`newsletter\`
            SET \`cityFilter\` = JSON_ARRAY(\`cityFilter_backup\`)
            WHERE \`cityFilter_backup\` IS NOT NULL AND \`cityFilter_backup\` != ''
        `);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`cityFilter_backup\``);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`cityFilter_backup\` varchar(255) NULL`);
            yield queryRunner.query(`
            UPDATE \`newsletter\`
            SET \`cityFilter_backup\` = JSON_UNQUOTE(JSON_EXTRACT(\`cityFilter\`, '$[0]'))
            WHERE \`cityFilter\` IS NOT NULL AND JSON_LENGTH(\`cityFilter\`) > 0
        `);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`cityFilter\``);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`cityFilter\` varchar(255) NULL`);
            yield queryRunner.query(`UPDATE \`newsletter\` SET \`cityFilter\` = \`cityFilter_backup\``);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`cityFilter_backup\``);
        });
    }
}
exports.updateNewsletterCityFilterToArray1753160165629 = updateNewsletterCityFilterToArray1753160165629;
//# sourceMappingURL=1753160165629-update-newsletter-city-filter-to-array.js.map