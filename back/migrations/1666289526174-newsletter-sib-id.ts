import { MigrationInterface, QueryRunner } from "typeorm";

export class newsletterSibId1666289526174 implements MigrationInterface {
    name = 'newsletterSibId1666289526174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`newsletterSibId\` varchar(60) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`newsletterSibId\``);
    }

}
