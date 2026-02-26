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
exports.newsletterSubjectMaxLength1708342417721 = void 0;
class newsletterSubjectMaxLength1708342417721 {
    constructor() {
        this.name = 'newsletterSubjectMaxLength1708342417721';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`newsletter\` CHANGE \`subject\` \`subject\` varchar(190) NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`newsletter\` CHANGE \`subject\` \`subject\` varchar(100) NULL`);
        });
    }
}
exports.newsletterSubjectMaxLength1708342417721 = newsletterSubjectMaxLength1708342417721;
//# sourceMappingURL=1708342417721-newsletter-subject-max-length.js.map