import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateJobsNew1655821803226 implements MigrationInterface {
    name = 'candidateJobsNew1655821803226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD \`jobId\` varchar(36) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`jobId\``);
    }

}
