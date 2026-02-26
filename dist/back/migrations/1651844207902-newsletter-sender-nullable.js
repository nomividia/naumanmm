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
exports.newsletterSenderNullable1651844207902 = void 0;
class newsletterSenderNullable1651844207902 {
    constructor() {
        this.name = 'newsletterSenderNullable1651844207902';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("ALTER TABLE `newsletter` CHANGE `sender` `sender` varchar(200) NULL");
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("ALTER TABLE `newsletter` CHANGE `sender` `sender` varchar(200) NOT NULL");
        });
    }
}
exports.newsletterSenderNullable1651844207902 = newsletterSenderNullable1651844207902;
//# sourceMappingURL=1651844207902-newsletter-sender-nullable.js.map