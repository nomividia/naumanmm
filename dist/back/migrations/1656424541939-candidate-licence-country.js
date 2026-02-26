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
exports.candidateLicenceCountry1656424541939 = void 0;
class candidateLicenceCountry1656424541939 {
    constructor() {
        this.name = 'candidateLicenceCountry1656424541939';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-licences\` ADD \`countryCode\` varchar(36) NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidate-licences\` DROP COLUMN \`countryCode\``);
        });
    }
}
exports.candidateLicenceCountry1656424541939 = candidateLicenceCountry1656424541939;
//# sourceMappingURL=1656424541939-candidate-licence-country.js.map