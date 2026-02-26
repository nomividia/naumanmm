import { MigrationInterface, QueryRunner } from 'typeorm';

export class resumeDateFormatOption1760932469673 implements MigrationInterface {
    name = 'resumeDateFormatOption1760932469673';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`candidate-jobs\` ADD \`showMonthInResume\` tinyint NOT NULL DEFAULT 1`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`candidate-jobs\` DROP COLUMN \`showMonthInResume\``,
        );
    }
}
