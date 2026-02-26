import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateAdditionalEmails1770500000000 implements MigrationInterface {
    name = 'candidateAdditionalEmails1770500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD \`additionalEmails\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`additionalEmails\``);
    }

}
