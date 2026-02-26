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
exports.jobsFieldsLazy1674734696953 = void 0;
class jobsFieldsLazy1674734696953 {
    constructor() {
        this.name = 'jobsFieldsLazy1674734696953';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`jobs\` ADD \`moduleName\` varchar(200) NULL`);
            yield queryRunner.query(`ALTER TABLE \`jobs\` ADD \`modulePath\` text NULL`);
            yield queryRunner.query(`ALTER TABLE \`jobs\` ADD \`servicePath\` text NULL`);
            yield queryRunner.query(`ALTER TABLE \`jobs\` CHANGE \`applicationServiceName\` \`applicationServiceName\` varchar(150) NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`jobs\` CHANGE \`applicationServiceName\` \`applicationServiceName\` varchar(150) NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`jobs\` DROP COLUMN \`servicePath\``);
            yield queryRunner.query(`ALTER TABLE \`jobs\` DROP COLUMN \`modulePath\``);
            yield queryRunner.query(`ALTER TABLE \`jobs\` DROP COLUMN \`moduleName\``);
        });
    }
}
exports.jobsFieldsLazy1674734696953 = jobsFieldsLazy1674734696953;
//# sourceMappingURL=1674734696953-jobs-fields-lazy.js.map