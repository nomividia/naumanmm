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
exports.candidateDptsRemoveCountry1675870311304 = void 0;
class candidateDptsRemoveCountry1675870311304 {
    constructor() {
        this.name = 'candidateDptsRemoveCountry1675870311304';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-department\` DROP COLUMN \`country\``);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-department\` ADD \`country\` varchar(2) NOT NULL`);
        });
    }
}
exports.candidateDptsRemoveCountry1675870311304 = candidateDptsRemoveCountry1675870311304;
//# sourceMappingURL=1675870311304-candidate-dpts-remove-country.js.map