import { MigrationInterface, QueryRunner } from 'typeorm';

export class deleteTraining1753766248160 implements MigrationInterface {
    name = 'deleteTraining1753766248160';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`candidates\` DROP COLUMN \`receivedTraining\``,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`candidates\` ADD \`receivedTraining\` tinyint NOT NULL DEFAULT '0'`,
        );
    }
}
