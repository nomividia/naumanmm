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
exports.applicationLinkedToCandidate1652287831558 = void 0;
class applicationLinkedToCandidate1652287831558 {
    constructor() {
        this.name = 'applicationLinkedToCandidate1652287831558';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("ALTER TABLE `candidate-applications` ADD `linkedToCandidate` tinyint NOT NULL DEFAULT 0");
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("ALTER TABLE `candidate-applications` DROP COLUMN `linkedToCandidate`");
        });
    }
}
exports.applicationLinkedToCandidate1652287831558 = applicationLinkedToCandidate1652287831558;
//# sourceMappingURL=1652287831558-application-linked-to-candidate.js.map