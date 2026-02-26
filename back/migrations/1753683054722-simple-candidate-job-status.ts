import {MigrationInterface, QueryRunner} from "typeorm";

export class simpleCandidateJobStatus1753683054722 implements MigrationInterface {
    name = 'simpleCandidateJobStatus1753683054722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` DROP FOREIGN KEY \`FK_367bd3292e4bf7b76080285478e\``);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` CHANGE \`referenceStatusId\` \`status\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` ADD \`status\` enum ('VALIDATED', 'REFUSED', 'PENDING') NOT NULL DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` ADD \`status\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` CHANGE \`status\` \`referenceStatusId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` ADD CONSTRAINT \`FK_367bd3292e4bf7b76080285478e\` FOREIGN KEY (\`referenceStatusId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
