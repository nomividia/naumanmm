import {MigrationInterface, QueryRunner} from "typeorm";

export class addIsGoodReference1722101742277 implements MigrationInterface {
    name = 'addIsGoodReference1722101742277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` ADD \`isGoodReference\` tinyint NOT NULL DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` DROP COLUMN \`isGoodReference\``);
    }

}
