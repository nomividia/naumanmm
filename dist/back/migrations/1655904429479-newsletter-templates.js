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
exports.newsletterTemplates1655904429479 = void 0;
class newsletterTemplates1655904429479 {
    constructor() {
        this.name = 'newsletterTemplates1655904429479';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`newsletter-templates\` (\`id\` varchar(36) NOT NULL, \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`disabled\` tinyint NOT NULL DEFAULT '0', \`content\` MEDIUMTEXT NOT NULL,\`title\` varchar(255) NOT NULL,\`subject\` varchar(100) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE \`newsletter-templates\``);
        });
    }
}
exports.newsletterTemplates1655904429479 = newsletterTemplates1655904429479;
//# sourceMappingURL=1655904429479-newsletter-templates.js.map