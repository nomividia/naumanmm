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
exports.recoverNewsletterCityFilterData1753160165630 = void 0;
class recoverNewsletterCityFilterData1753160165630 {
    constructor() {
        this.name = 'recoverNewsletterCityFilterData1753160165630';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const newsletters = yield queryRunner.query(`
            SELECT id, cityFilter FROM \`newsletter\`
            WHERE cityFilter IS NULL OR cityFilter = '[]' OR cityFilter = '[""]'
        `);
            console.log('Found newsletters with missing cityFilter data:', newsletters.length);
            for (const newsletter of newsletters) {
                yield queryRunner.query(`
                UPDATE \`newsletter\`
                SET \`cityFilter\` = JSON_ARRAY()
                WHERE id = ? AND (cityFilter IS NULL OR cityFilter = '[]' OR cityFilter = '[""]')
            `, [newsletter.id]);
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.recoverNewsletterCityFilterData1753160165630 = recoverNewsletterCityFilterData1753160165630;
//# sourceMappingURL=1753160165630-recover-newsletter-city-filter-data.js.map