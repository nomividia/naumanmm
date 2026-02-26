import { MigrationInterface, QueryRunner } from "typeorm";

export class nullableGenderId1724769882387 implements MigrationInterface {
    name = 'nullableGenderId1724769882387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE \`candidates\` DROP FOREIGN KEY \`FK_7d012e360f797bf376d22cad7e9\``);
        await queryRunner.query(`ALTER TABLE \`candidates\` CHANGE \`genderId\` \`genderId\` varchar(36) NULL`);
        // await queryRunner.query(`ALTER TABLE \`candidates\` ADD CONSTRAINT \`FK_7d012e360f797bf376d22cad7e9\` FOREIGN KEY (\`genderId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE \`candidates\` DROP FOREIGN KEY \`FK_7d012e360f797bf376d22cad7e9\``);
        await queryRunner.query(`ALTER TABLE \`candidates\` CHANGE \`genderId\` \`genderId\` varchar(36) NOT NULL`);
        // await queryRunner.query(`ALTER TABLE \`candidates\` ADD CONSTRAINT \`FK_7d012e360f797bf376d22cad7e9\` FOREIGN KEY (\`genderId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
