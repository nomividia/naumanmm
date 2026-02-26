import { MigrationInterface, QueryRunner } from "typeorm";

export class newsletterType1667394399583 implements MigrationInterface {
    name = 'newsletterType1667394399583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`type\` enum ('Email', 'SMS') NOT NULL DEFAULT 'Email'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`type\``);
    }

}
