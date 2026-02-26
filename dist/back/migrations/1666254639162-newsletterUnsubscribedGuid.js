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
exports.newsletterUnsubscribedGuid1666254639162 = void 0;
class newsletterUnsubscribedGuid1666254639162 {
    constructor() {
        this.name = 'newsletterUnsubscribedGuid1666254639162';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates\` ADD \`newsletterUnsubscribedGuid\` varchar(36) NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`newsletterUnsubscribedGuid\``);
        });
    }
}
exports.newsletterUnsubscribedGuid1666254639162 = newsletterUnsubscribedGuid1666254639162;
//# sourceMappingURL=1666254639162-newsletterUnsubscribedGuid.js.map