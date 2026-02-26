import {MigrationInterface, QueryRunner} from "typeorm";

export class applicationLinkedToCandidate1652287831558 implements MigrationInterface {
    name = 'applicationLinkedToCandidate1652287831558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `candidate-applications` ADD `linkedToCandidate` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `candidate-applications` DROP COLUMN `linkedToCandidate`");
    }

}
