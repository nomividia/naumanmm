import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateApplicationGuid1657202405367 implements MigrationInterface {
    name = 'candidateApplicationGuid1657202405367';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-applications\` ADD \`guidExchange\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`candidate-applications\` ADD UNIQUE INDEX \`IDX_d9c6d08fd4b3626f75a917045c\` (\`guidExchange\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-applications\` DROP INDEX \`IDX_d9c6d08fd4b3626f75a917045c\``);
        await queryRunner.query(`ALTER TABLE \`candidate-applications\` DROP COLUMN \`guidExchange\``);
    }

}
