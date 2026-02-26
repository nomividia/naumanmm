import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateApplicationUnsubscribe1672906632415 implements MigrationInterface {
    name = 'candidateApplicationUnsubscribe1672906632415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-applications\` ADD \`newsletterUnsubscribed\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`candidate-applications\` ADD \`newsletterUnsubscribedGuid\` varchar(36) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-applications\` DROP COLUMN \`newsletterUnsubscribedGuid\``);
        await queryRunner.query(`ALTER TABLE \`candidate-applications\` DROP COLUMN \`newsletterUnsubscribed\``);
    }

}
