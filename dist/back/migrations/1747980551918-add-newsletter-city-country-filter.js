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
exports.addNewsletterCityCountryFilter1747980551918 = void 0;
class addNewsletterCityCountryFilter1747980551918 {
    constructor() {
        this.name = 'addNewsletterCityCountryFilter1747980551918';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`cityFilter\` varchar(255) NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`countriesFilter\` varchar(255) NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`countriesFilter\``);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`cityFilter\``);
        });
    }
}
exports.addNewsletterCityCountryFilter1747980551918 = addNewsletterCityCountryFilter1747980551918;
//# sourceMappingURL=1747980551918-add-newsletter-city-country-filter.js.map