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
exports.addIsGoodReference1722101742277 = void 0;
class addIsGoodReference1722101742277 {
    constructor() {
        this.name = 'addIsGoodReference1722101742277';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` ADD \`isGoodReference\` tinyint NOT NULL DEFAULT 1`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` DROP COLUMN \`isGoodReference\``);
        });
    }
}
exports.addIsGoodReference1722101742277 = addIsGoodReference1722101742277;
//# sourceMappingURL=1722101742277-addIsGoodReference.js.map