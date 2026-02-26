import { MigrationInterface, QueryRunner } from "typeorm";

export class addUseridOnHistory1656412920900 implements MigrationInterface {
    name = 'addUseridOnHistory1656412920900'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE \`history\` ADD \`userId\` varchar(36) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE \`history\` DROP COLUMN \`userId\``);
    }

}
