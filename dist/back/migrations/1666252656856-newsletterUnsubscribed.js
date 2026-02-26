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
exports.newsletterUnsubscribed1666252656856 = void 0;
class newsletterUnsubscribed1666252656856 {
    constructor() {
        this.name = 'newsletterUnsubscribed1666252656856';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates\` ADD \`newsletterUnsubscribed\` tinyint NOT NULL DEFAULT '0'`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`newsletterUnsubscribed\``);
        });
    }
}
exports.newsletterUnsubscribed1666252656856 = newsletterUnsubscribed1666252656856;
//# sourceMappingURL=1666252656856-newsletterUnsubscribed.js.map