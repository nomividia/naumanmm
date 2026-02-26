import { MigrationInterface, QueryRunner } from "typeorm";

export class addEntityId1656427183627 implements MigrationInterface {
    name = 'addEntityId1656427183627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history\` ADD \`entityId\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history\` DROP COLUMN \`entityId\``);
    }

}
