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
exports.setNullableHistory1656406940202 = void 0;
class setNullableHistory1656406940202 {
    constructor() {
        this.name = 'setNullableHistory1656406940202';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`history\` CHANGE \`valueBefore\` \`valueBefore\` varchar(100) NULL`);
            yield queryRunner.query(`ALTER TABLE \`history\` CHANGE \`valueAfter\` \`valueAfter\` varchar(100) NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`history\` CHANGE \`valueAfter\` \`valueAfter\` varchar(100) NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`history\` CHANGE \`valueBefore\` \`valueBefore\` varchar(100) NOT NULL`);
        });
    }
}
exports.setNullableHistory1656406940202 = setNullableHistory1656406940202;
//# sourceMappingURL=1656406940202-set-nullable-history.js.map