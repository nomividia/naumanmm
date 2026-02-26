import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateResumeExperienceLocation1656423189397 implements MigrationInterface {
    name = 'candidateResumeExperienceLocation1656423189397';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` ADD \`city\` varchar(150) NULL`);
        await queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` ADD \`country\` varchar(100) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` DROP COLUMN \`country\``);
        await queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` DROP COLUMN \`city\``);
    }

}
