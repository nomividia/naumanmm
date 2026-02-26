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
exports.addTripleCompositeIndexCandidateApplication1748515040135 = void 0;
class addTripleCompositeIndexCandidateApplication1748515040135 {
    constructor() {
        this.name = 'addTripleCompositeIndexCandidateApplication1748515040135';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            CREATE INDEX idx_status_disabled_creation ON \`candidate-applications\` (\`applyStatusId\`, \`disabled\`, \`creationDate\`)
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            DROP INDEX idx_status_disabled_creation ON \`candidate-applications\`
        `);
        });
    }
}
exports.addTripleCompositeIndexCandidateApplication1748515040135 = addTripleCompositeIndexCandidateApplication1748515040135;
//# sourceMappingURL=1748515040135-add-triple-composite-index-candidate-application.js.map