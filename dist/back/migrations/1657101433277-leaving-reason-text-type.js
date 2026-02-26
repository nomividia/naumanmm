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
exports.leavingReasonTextType1657101433277 = void 0;
class leavingReasonTextType1657101433277 {
    constructor() {
        this.name = 'leavingReasonTextType1657101433277';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` MODIFY \`leavingReason\` TEXT NULL;`);
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` MODIFY \`leavingReason\` TEXT NULL;`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` MODIFY \`leavingReason\` varchar(50) NULL;`);
            yield queryRunner.query(`ALTER TABLE \`candidate-jobs\` MODIFY \`leavingReason\` varchar(50) NULL;`);
        });
    }
}
exports.leavingReasonTextType1657101433277 = leavingReasonTextType1657101433277;
//# sourceMappingURL=1657101433277-leaving-reason-text-type.js.map