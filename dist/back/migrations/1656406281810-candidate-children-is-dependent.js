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
exports.candidateChildrenIsDependent1656406281810 = void 0;
class candidateChildrenIsDependent1656406281810 {
    constructor() {
        this.name = 'candidateChildrenIsDependent1656406281810';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-children\` ADD \`isDependent\` tinyint NOT NULL DEFAULT 0`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-children\` DROP COLUMN \`isDependent\``);
        });
    }
}
exports.candidateChildrenIsDependent1656406281810 = candidateChildrenIsDependent1656406281810;
//# sourceMappingURL=1656406281810-candidate-children-is-dependent.js.map