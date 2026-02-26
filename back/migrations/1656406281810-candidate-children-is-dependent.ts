import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateChildrenIsDependent1656406281810 implements MigrationInterface {
    name = 'candidateChildrenIsDependent1656406281810';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-children\` ADD \`isDependent\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-children\` DROP COLUMN \`isDependent\``);
    }

}
