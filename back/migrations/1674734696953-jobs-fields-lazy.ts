import { MigrationInterface, QueryRunner } from "typeorm";

export class jobsFieldsLazy1674734696953 implements MigrationInterface {
    name = 'jobsFieldsLazy1674734696953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jobs\` ADD \`moduleName\` varchar(200) NULL`);
        await queryRunner.query(`ALTER TABLE \`jobs\` ADD \`modulePath\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`jobs\` ADD \`servicePath\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`jobs\` CHANGE \`applicationServiceName\` \`applicationServiceName\` varchar(150) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jobs\` CHANGE \`applicationServiceName\` \`applicationServiceName\` varchar(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`jobs\` DROP COLUMN \`servicePath\``);
        await queryRunner.query(`ALTER TABLE \`jobs\` DROP COLUMN \`modulePath\``);
        await queryRunner.query(`ALTER TABLE \`jobs\` DROP COLUMN \`moduleName\``);
    }

}
