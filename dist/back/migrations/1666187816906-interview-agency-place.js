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
exports.interviewAgencyPlace1666187816906 = void 0;
class interviewAgencyPlace1666187816906 {
    constructor() {
        this.name = 'interviewAgencyPlace1666187816906';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`interviews\` CHANGE \`agencyPlace\` \`agencyPlace\` varchar(80) NULL `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`interviews\` CHANGE \`agencyPlace\` \`agencyPlace\` text NULL `);
        });
    }
}
exports.interviewAgencyPlace1666187816906 = interviewAgencyPlace1666187816906;
//# sourceMappingURL=1666187816906-interview-agency-place.js.map