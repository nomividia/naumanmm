import { MigrationInterface, QueryRunner } from "typeorm";

export class relationUserHistory1656413944387 implements MigrationInterface {
    name = 'relationUserHistory1656413944387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history\` ADD CONSTRAINT \`FK_7d339708f0fa8446e3c4128dea9\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history\` DROP FOREIGN KEY \`FK_7d339708f0fa8446e3c4128dea9\``);
    }

}
