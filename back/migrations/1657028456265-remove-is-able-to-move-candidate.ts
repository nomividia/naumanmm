import { MigrationInterface, QueryRunner } from "typeorm";

export class removeIsAbleToMoveCandidate1657028456265 implements MigrationInterface {
    name = 'removeIsAbleToMoveCandidate1657028456265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`isAbleToMove\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD \`isAbleToMove\` tinyint NULL`);
    }

}
