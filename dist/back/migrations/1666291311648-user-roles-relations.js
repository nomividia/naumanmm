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
exports.userRolesRelations1666291311648 = void 0;
class userRolesRelations1666291311648 {
    constructor() {
        this.name = 'userRolesRelations1666291311648';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_13380e7efec83468d73fc37938e\``);
            yield queryRunner.query(`ALTER TABLE \`roles_rights\` DROP FOREIGN KEY \`FK_4e206355419b43fe51eb9aade07\``);
            yield queryRunner.query(`ALTER TABLE \`roles_rights\` DROP FOREIGN KEY \`FK_befefd0be7fa3f3ce92a460ecb1\``);
            yield queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_13380e7efec83468d73fc37938e\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE \`roles_rights\` ADD CONSTRAINT \`FK_4e206355419b43fe51eb9aade07\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE \`roles_rights\` ADD CONSTRAINT \`FK_befefd0be7fa3f3ce92a460ecb1\` FOREIGN KEY (\`appRightsId\`) REFERENCES \`app_rights\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`roles_rights\` DROP FOREIGN KEY \`FK_befefd0be7fa3f3ce92a460ecb1\``);
            yield queryRunner.query(`ALTER TABLE \`roles_rights\` DROP FOREIGN KEY \`FK_4e206355419b43fe51eb9aade07\``);
            yield queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_13380e7efec83468d73fc37938e\``);
            yield queryRunner.query(`ALTER TABLE \`roles_rights\` ADD CONSTRAINT \`FK_befefd0be7fa3f3ce92a460ecb1\` FOREIGN KEY (\`appRightsId\`) REFERENCES \`app_rights\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`roles_rights\` ADD CONSTRAINT \`FK_4e206355419b43fe51eb9aade07\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_13380e7efec83468d73fc37938e\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
}
exports.userRolesRelations1666291311648 = userRolesRelations1666291311648;
//# sourceMappingURL=1666291311648-user-roles-relations.js.map