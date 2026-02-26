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
exports.addHistoryTable1656405592181 = void 0;
class addHistoryTable1656405592181 {
    constructor() {
        this.name = 'addHistoryTable1656405592181';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`history\` (\`id\` varchar(36) NOT NULL, \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`disabled\` tinyint NOT NULL DEFAULT '0', \`entity\` varchar(255) NOT NULL, \`field\` varchar(255) NOT NULL, \`date\` datetime NOT NULL, \`valueBefore\` varchar(100) NOT NULL, \`valueAfter\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE \`history\``);
        });
    }
}
exports.addHistoryTable1656405592181 = addHistoryTable1656405592181;
//# sourceMappingURL=1656405592181-add-history-table.js.map