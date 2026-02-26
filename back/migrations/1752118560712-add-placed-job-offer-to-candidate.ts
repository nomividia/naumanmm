import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlacedJobOfferToCandidate1752118560712
    implements MigrationInterface
{
    name = 'AddPlacedJobOfferToCandidate1752118560712';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`candidates\` ADD \`placedJobOfferId\` varchar(36) NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`candidates\` DROP COLUMN \`placedJobOfferId\``,
        );
    }
}
