import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateReferencesValidated1656585023140 implements MigrationInterface {
    name = 'candidateReferencesValidated1656585023140';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD \`referencesValidated\` tinyint NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`referencesValidated\``);
    }

}
