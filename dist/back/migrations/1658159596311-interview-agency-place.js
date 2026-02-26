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
exports.interviewAgencyPlace1658159596311 = void 0;
class interviewAgencyPlace1658159596311 {
    constructor() {
        this.name = 'interviewAgencyPlace1658159596311';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`interviews\` ADD \`agencyPlace\` text NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`interviews\` DROP COLUMN \`agencyPlace\``);
        });
    }
}
exports.interviewAgencyPlace1658159596311 = interviewAgencyPlace1658159596311;
//# sourceMappingURL=1658159596311-interview-agency-place.js.map