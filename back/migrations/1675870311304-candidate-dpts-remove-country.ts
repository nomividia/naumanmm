import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateDptsRemoveCountry1675870311304 implements MigrationInterface {
    name = 'candidateDptsRemoveCountry1675870311304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-department\` DROP COLUMN \`country\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-department\` ADD \`country\` varchar(2) NOT NULL`);
    }

}
