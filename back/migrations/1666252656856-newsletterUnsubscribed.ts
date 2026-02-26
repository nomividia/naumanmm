import { MigrationInterface, QueryRunner } from "typeorm";

export class newsletterUnsubscribed1666252656856 implements MigrationInterface {
    name = 'newsletterUnsubscribed1666252656856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_13380e7efec83468d73fc37938e\``);
        // await queryRunner.query(`ALTER TABLE \`roles_rights\` DROP FOREIGN KEY \`FK_4e206355419b43fe51eb9aade07\``);
        // await queryRunner.query(`ALTER TABLE \`roles_rights\` DROP FOREIGN KEY \`FK_befefd0be7fa3f3ce92a460ecb1\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_ASC\` ON \`candidates\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_DESC\` ON \`candidates\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_ASC\` ON \`users\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_DESC\` ON \`users\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_ASC\` ON \`customer\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_DESC\` ON \`customer\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_ASC\` ON \`job-offers\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_DESC\` ON \`job-offers\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_ASC\` ON \`candidate-applications\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_DESC\` ON \`candidate-applications\``);
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD \`newsletterUnsubscribed\` tinyint NOT NULL DEFAULT '0'`);
        // await queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_13380e7efec83468d73fc37938e\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        // await queryRunner.query(`ALTER TABLE \`roles_rights\` ADD CONSTRAINT \`FK_4e206355419b43fe51eb9aade07\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        // await queryRunner.query(`ALTER TABLE \`roles_rights\` ADD CONSTRAINT \`FK_befefd0be7fa3f3ce92a460ecb1\` FOREIGN KEY (\`appRightsId\`) REFERENCES \`app_rights\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE \`roles_rights\` DROP FOREIGN KEY \`FK_befefd0be7fa3f3ce92a460ecb1\``);
        // await queryRunner.query(`ALTER TABLE \`roles_rights\` DROP FOREIGN KEY \`FK_4e206355419b43fe51eb9aade07\``);
        // await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_13380e7efec83468d73fc37938e\``);
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`newsletterUnsubscribed\``);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_DESC\` ON \`candidate-applications\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_ASC\` ON \`candidate-applications\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_DESC\` ON \`job-offers\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_ASC\` ON \`job-offers\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_DESC\` ON \`customer\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_ASC\` ON \`customer\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_DESC\` ON \`users\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_ASC\` ON \`users\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_DESC\` ON \`candidates\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_ASC\` ON \`candidates\` (\`creationDate\`)`);
        // await queryRunner.query(`ALTER TABLE \`roles_rights\` ADD CONSTRAINT \`FK_befefd0be7fa3f3ce92a460ecb1\` FOREIGN KEY (\`appRightsId\`) REFERENCES \`app_rights\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE \`roles_rights\` ADD CONSTRAINT \`FK_4e206355419b43fe51eb9aade07\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_13380e7efec83468d73fc37938e\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
