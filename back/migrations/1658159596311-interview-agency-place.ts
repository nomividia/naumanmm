import { MigrationInterface, QueryRunner } from "typeorm";

export class interviewAgencyPlace1658159596311 implements MigrationInterface {
    name = 'interviewAgencyPlace1658159596311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`interviews\` ADD \`agencyPlace\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`interviews\` DROP COLUMN \`agencyPlace\``);
    }

}
