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
exports.jobOfferPublicLink1673868478567 = void 0;
class jobOfferPublicLink1673868478567 {
    constructor() {
        this.name = 'jobOfferPublicLink1673868478567';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`job-offers\` MODIFY \`publicLink\` text NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`job-offers\` MODIFY \`publicLink\` varchar(255) NULL`);
        });
    }
}
exports.jobOfferPublicLink1673868478567 = jobOfferPublicLink1673868478567;
//# sourceMappingURL=1673868478567-job-offer-public-link.js.map