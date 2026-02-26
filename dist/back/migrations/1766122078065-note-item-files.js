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
exports.noteItemFiles1766122078065 = void 0;
class noteItemFiles1766122078065 {
    constructor() {
        this.name = 'noteItemFiles1766122078065';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`note-item-files\` (
                \`id\` varchar(36) NOT NULL,
                \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modifDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`disabled\` tinyint NOT NULL DEFAULT '0',
                \`fileId\` varchar(36) NULL,
                \`noteItemId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB`);
            yield queryRunner.query(`ALTER TABLE \`note-item-files\` ADD CONSTRAINT \`FK_note_item_files_file\` FOREIGN KEY (\`fileId\`) REFERENCES \`app_files\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`note-item-files\` ADD CONSTRAINT \`FK_note_item_files_note_item\` FOREIGN KEY (\`noteItemId\`) REFERENCES \`note-item\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`note-item-files\` DROP FOREIGN KEY \`FK_note_item_files_note_item\``);
            yield queryRunner.query(`ALTER TABLE \`note-item-files\` DROP FOREIGN KEY \`FK_note_item_files_file\``);
            yield queryRunner.query(`DROP TABLE \`note-item-files\``);
        });
    }
}
exports.noteItemFiles1766122078065 = noteItemFiles1766122078065;
//# sourceMappingURL=1766122078065-note-item-files.js.map