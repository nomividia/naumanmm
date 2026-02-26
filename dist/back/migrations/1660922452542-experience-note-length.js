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
exports.experienceNoteLength1660922452542 = void 0;
class experienceNoteLength1660922452542 {
    constructor() {
        this.name = 'experienceNoteLength1660922452542';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("ALTER TABLE \`job-references\` CHANGE \`note\` \`note\` text NULL");
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("ALTER TABLE \`job-references\` CHANGE \`note\` \`note\` varchar(100) NULL");
        });
    }
}
exports.experienceNoteLength1660922452542 = experienceNoteLength1660922452542;
//# sourceMappingURL=1660922452542-experience-note-length.js.map