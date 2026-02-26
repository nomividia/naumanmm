import { MigrationInterface, QueryRunner } from "typeorm";

export class userRolesRelations1666291311648 implements MigrationInterface {
    name = 'userRolesRelations1666291311648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_13380e7efec83468d73fc37938e\``);
        await queryRunner.query(`ALTER TABLE \`roles_rights\` DROP FOREIGN KEY \`FK_4e206355419b43fe51eb9aade07\``);
        await queryRunner.query(`ALTER TABLE \`roles_rights\` DROP FOREIGN KEY \`FK_befefd0be7fa3f3ce92a460ecb1\``);
        await queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_13380e7efec83468d73fc37938e\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`roles_rights\` ADD CONSTRAINT \`FK_4e206355419b43fe51eb9aade07\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`roles_rights\` ADD CONSTRAINT \`FK_befefd0be7fa3f3ce92a460ecb1\` FOREIGN KEY (\`appRightsId\`) REFERENCES \`app_rights\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`roles_rights\` DROP FOREIGN KEY \`FK_befefd0be7fa3f3ce92a460ecb1\``);
        await queryRunner.query(`ALTER TABLE \`roles_rights\` DROP FOREIGN KEY \`FK_4e206355419b43fe51eb9aade07\``);
        await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_13380e7efec83468d73fc37938e\``);
        await queryRunner.query(`ALTER TABLE \`roles_rights\` ADD CONSTRAINT \`FK_befefd0be7fa3f3ce92a460ecb1\` FOREIGN KEY (\`appRightsId\`) REFERENCES \`app_rights\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`roles_rights\` ADD CONSTRAINT \`FK_4e206355419b43fe51eb9aade07\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_13380e7efec83468d73fc37938e\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
