import { MigrationInterface, QueryRunner } from "typeorm";

export class editInterviewConfirmationType1658157064434 implements MigrationInterface {
    name = 'editInterviewConfirmationType1658157064434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`interviews\` ADD \`candidateResponse\` enum ('accepted', 'refused') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE \`interviews\` DROP COLUMN \`candidateResponse\``);
    }

}
