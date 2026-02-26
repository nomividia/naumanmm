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
exports.editInterviewConfirmationType1658157064434 = void 0;
class editInterviewConfirmationType1658157064434 {
    constructor() {
        this.name = 'editInterviewConfirmationType1658157064434';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`interviews\` ADD \`candidateResponse\` enum ('accepted', 'refused') NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`interviews\` DROP COLUMN \`candidateResponse\``);
        });
    }
}
exports.editInterviewConfirmationType1658157064434 = editInterviewConfirmationType1658157064434;
//# sourceMappingURL=1658157064434-edit-interview-confirmation-type.js.map