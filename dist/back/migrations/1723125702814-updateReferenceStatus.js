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
exports.updateReferenceStatus1723125702814 = void 0;
class updateReferenceStatus1723125702814 {
    constructor() {
        this.name = 'updateReferenceStatus1723125702814';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` CHANGE \`referenceStatus\` \`referenceStatusId\` varchar(20) NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` DROP COLUMN \`referenceStatusId\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` ADD \`referenceStatusId\` varchar(36) NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` ADD CONSTRAINT \`FK_367bd3292e4bf7b76080285478e\` FOREIGN KEY (\`referenceStatusId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` DROP FOREIGN KEY \`FK_367bd3292e4bf7b76080285478e\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` DROP COLUMN \`referenceStatusId\``);
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` ADD \`referenceStatusId\` varchar(20) NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` CHANGE \`referenceStatusId\` \`referenceStatus\` varchar(20) NULL`);
        });
    }
}
exports.updateReferenceStatus1723125702814 = updateReferenceStatus1723125702814;
//# sourceMappingURL=1723125702814-updateReferenceStatus.js.map