import { MigrationInterface, QueryRunner } from "typeorm";

export class newsletterListId1668074506349 implements MigrationInterface {
    name = 'newsletterListId1668074506349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`newsletterListSibId\` varchar(60) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`newsletterListSibId\``);
    }

}
