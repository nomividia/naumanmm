import { MigrationInterface, QueryRunner } from "typeorm";

export class historyEntityFieldsLength1662451271712 implements MigrationInterface {
    name = 'historyEntityFieldsLength1662451271712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history\` DROP COLUMN \`entityId\``);
        await queryRunner.query(`ALTER TABLE \`history\` ADD \`entityId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`history\` DROP COLUMN \`valueBefore\``);
        await queryRunner.query(`ALTER TABLE \`history\` ADD \`valueBefore\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`history\` DROP COLUMN \`valueAfter\``);
        await queryRunner.query(`ALTER TABLE \`history\` ADD \`valueAfter\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history\` DROP COLUMN \`valueAfter\``);
        await queryRunner.query(`ALTER TABLE \`history\` ADD \`valueAfter\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`history\` DROP COLUMN \`valueBefore\``);
        await queryRunner.query(`ALTER TABLE \`history\` ADD \`valueBefore\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`history\` DROP COLUMN \`entityId\``);
        await queryRunner.query(`ALTER TABLE \`history\` ADD \`entityId\` varchar(255) NOT NULL`);
    }

}
