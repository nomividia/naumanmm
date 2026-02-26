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
exports.relationUserHistory1656413944387 = void 0;
class relationUserHistory1656413944387 {
    constructor() {
        this.name = 'relationUserHistory1656413944387';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`history\` ADD CONSTRAINT \`FK_7d339708f0fa8446e3c4128dea9\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`history\` DROP FOREIGN KEY \`FK_7d339708f0fa8446e3c4128dea9\``);
        });
    }
}
exports.relationUserHistory1656413944387 = relationUserHistory1656413944387;
//# sourceMappingURL=1656413944387-relation-user-history.js.map