import { MigrationInterface, QueryRunner } from "typeorm";

export class newsletterHtmlContent1668682882639 implements MigrationInterface {
    name = 'newsletterHtmlContent1668682882639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`htmlFullContent\` longtext NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`htmlFullContent\``);
    }

}
