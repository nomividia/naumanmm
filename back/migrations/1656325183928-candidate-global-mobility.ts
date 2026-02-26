import {MigrationInterface, QueryRunner} from "typeorm";

export class candidateGlobalMobility1656325183928 implements MigrationInterface {
    name = 'candidateGlobalMobility1656325183928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD \`globalMobility\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`globalMobility\``);
    }

}
