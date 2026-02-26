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
exports.partnerEmailPhone1674740030354 = void 0;
class partnerEmailPhone1674740030354 {
    constructor() {
        this.name = 'partnerEmailPhone1674740030354';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates\` ADD \`partnerEmail\` varchar(255) NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidates\` ADD \`partnerPhone\` varchar(30) NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`partnerPhone\``);
            yield queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`partnerEmail\``);
        });
    }
}
exports.partnerEmailPhone1674740030354 = partnerEmailPhone1674740030354;
//# sourceMappingURL=1674740030354-partner-email-phone.js.map