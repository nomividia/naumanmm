import {MigrationInterface, QueryRunner} from "typeorm";

export class addNewsletterCityCountryFilter1747980551918 implements MigrationInterface {
    name = 'addNewsletterCityCountryFilter1747980551918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`cityFilter\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`countriesFilter\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`countriesFilter\``);
        await queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`cityFilter\``);
    }

}
