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
exports.addReferenceStatus1723124548252 = void 0;
class addReferenceStatus1723124548252 {
    constructor() {
        this.name = 'addReferenceStatus1723124548252';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` CHANGE \`isGoodReference\` \`referenceStatus\` tinyint NOT NULL DEFAULT '1'`);
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` DROP COLUMN \`referenceStatus\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` ADD \`referenceStatus\` varchar(20) NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` DROP COLUMN \`referenceStatus\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` ADD \`referenceStatus\` tinyint NOT NULL DEFAULT '1'`);
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` CHANGE \`referenceStatus\` \`isGoodReference\` tinyint NOT NULL DEFAULT '1'`);
        });
    }
}
exports.addReferenceStatus1723124548252 = addReferenceStatus1723124548252;
//# sourceMappingURL=1723124548252-addReferenceStatus.js.map