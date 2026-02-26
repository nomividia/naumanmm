import {MigrationInterface, QueryRunner} from "typeorm";

export class addInterviewNoShow1769900000000 implements MigrationInterface {
    name = 'addInterviewNoShow1769900000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`interviews\` ADD \`noShow\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`interviews\` DROP COLUMN \`noShow\``);
    }

}
