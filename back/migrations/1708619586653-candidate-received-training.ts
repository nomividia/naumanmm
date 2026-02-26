import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateReceivedTraining1708619586653 implements MigrationInterface {
    name = 'candidateReceivedTraining1708619586653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD \`receivedTraining\` tinyint NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`receivedTraining\``);
    }

}
