import { MigrationInterface, QueryRunner } from "typeorm";

export class newsletterLanguage1656588810577 implements MigrationInterface {
    name = 'newsletterLanguage1656588810577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`newsletter\` CHANGE \`language\` \`language\` enum ('fr', 'en') NOT NULL DEFAULT 'en'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`newsletter\` CHANGE \`language\` \`language\` enum ('FRANCAIS', 'ANGLAIS') NOT NULL DEFAULT 'FRANCAIS'`);
    }

}
