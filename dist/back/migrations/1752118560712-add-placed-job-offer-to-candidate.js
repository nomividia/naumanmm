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
exports.AddPlacedJobOfferToCandidate1752118560712 = void 0;
class AddPlacedJobOfferToCandidate1752118560712 {
    constructor() {
        this.name = 'AddPlacedJobOfferToCandidate1752118560712';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates\` ADD \`placedJobOfferId\` varchar(36) NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`placedJobOfferId\``);
        });
    }
}
exports.AddPlacedJobOfferToCandidate1752118560712 = AddPlacedJobOfferToCandidate1752118560712;
//# sourceMappingURL=1752118560712-add-placed-job-offer-to-candidate.js.map