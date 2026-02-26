import { MigrationInterface, QueryRunner } from 'typeorm';

export class candidateJobType1759843626515 implements MigrationInterface {
    name = 'candidateJobType1759843626515';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`candidate-jobs\` ADD \`type\` enum ('JOB', 'EDUCATION') NOT NULL DEFAULT 'JOB'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`candidate-jobs\` DROP COLUMN \`type\``,
        );
    }
}
