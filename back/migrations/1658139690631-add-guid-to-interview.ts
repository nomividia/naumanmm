import { MigrationInterface, QueryRunner } from "typeorm";

export class addGuidToInterview1658139690631 implements MigrationInterface {
    name = 'addGuidToInterview1658139690631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`interviews\` ADD \`guid\` varchar(36) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`interviews\` DROP COLUMN \`guid\``);
    }

}
