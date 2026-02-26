import {MigrationInterface, QueryRunner} from "typeorm";

export class removeJobId1655903631117 implements MigrationInterface {
    name = 'removeJobId1655903631117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`jobId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD \`jobId\` varchar(36) NULL`);
    }

}
