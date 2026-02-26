import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsTermsFieldsToCandidateApplication1764048139313
    implements MigrationInterface
{
    name = 'AddUsTermsFieldsToCandidateApplication1764048139313';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`candidate-applications\` ADD \`usTermsAcceptedAt\` datetime NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`candidate-applications\` ADD \`usTermsVersion\` varchar(20) NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`candidate-applications\` DROP COLUMN \`usTermsVersion\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`candidate-applications\` DROP COLUMN \`usTermsAcceptedAt\``,
        );
    }
}
