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
exports.candidateAllergies1657186100855 = void 0;
class candidateAllergies1657186100855 {
    constructor() {
        this.name = 'candidateAllergies1657186100855';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates\` ADD \`allergy\` enum ('AnyAllergies_CandidateAllergies', 'Dog_CandidateAllergies', 'Cat_CandidateAllergies', 'DogAndCat_CandidateAllergies') NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`allergy\``);
        });
    }
}
exports.candidateAllergies1657186100855 = candidateAllergies1657186100855;
//# sourceMappingURL=1657186100855-candidate-allergies.js.map