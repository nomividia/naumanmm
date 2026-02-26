import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateExperienceCurrentlyInPosition1708339031743 implements MigrationInterface {
    name = 'candidateExperienceCurrentlyInPosition1708339031743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` ADD \`currentlyInPosition\` tinyint NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` DROP COLUMN \`currentlyInPosition\``);
    }

}
