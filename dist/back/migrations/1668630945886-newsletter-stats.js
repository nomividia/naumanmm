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
exports.newsletterStats1668630945886 = void 0;
class newsletterStats1668630945886 {
    constructor() {
        this.name = 'newsletterStats1668630945886';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`sentCount\` int NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`deliveredCount\` int NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`answeredCount\` int NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`unsubscriptionsCount\` int NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`openedCount\` int NULL`);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`clickedCount\` int NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`clickedCount\``);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`openedCount\``);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`unsubscriptionsCount\``);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`answeredCount\``);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`deliveredCount\``);
            yield queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`sentCount\``);
        });
    }
}
exports.newsletterStats1668630945886 = newsletterStats1668630945886;
//# sourceMappingURL=1668630945886-newsletter-stats.js.map