import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateWorkUsFields1726044581349 implements MigrationInterface {
    name = 'candidateWorkUsFields1726044581349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-applications\` ADD \`allowed_to_work_us\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`candidate-applications\` ADD \`require_sponsorship_us\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD \`allowed_to_work_us\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD \`require_sponsorship_us\` tinyint NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`require_sponsorship_us\``);
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`allowed_to_work_us\``);
        await queryRunner.query(`ALTER TABLE \`candidate-applications\` DROP COLUMN \`require_sponsorship_us\``);
        await queryRunner.query(`ALTER TABLE \`candidate-applications\` DROP COLUMN \`allowed_to_work_us\``);
    }

}
