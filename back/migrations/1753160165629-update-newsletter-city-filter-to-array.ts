import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateNewsletterCityFilterToArray1753160165629
    implements MigrationInterface
{
    name = 'updateNewsletterCityFilterToArray1753160165629';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, backup existing data by creating a temporary column
        await queryRunner.query(
            `ALTER TABLE \`newsletter\` ADD \`cityFilter_backup\` varchar(255) NULL`,
        );
        await queryRunner.query(
            `UPDATE \`newsletter\` SET \`cityFilter_backup\` = \`cityFilter\``,
        );

        // Drop the old column and create the new JSON column
        await queryRunner.query(
            `ALTER TABLE \`newsletter\` DROP COLUMN \`cityFilter\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`newsletter\` ADD \`cityFilter\` json NULL`,
        );

        // Migrate existing data: convert single city to array format
        await queryRunner.query(`
            UPDATE \`newsletter\`
            SET \`cityFilter\` = JSON_ARRAY(\`cityFilter_backup\`)
            WHERE \`cityFilter_backup\` IS NOT NULL AND \`cityFilter_backup\` != ''
        `);

        // Drop the backup column
        await queryRunner.query(
            `ALTER TABLE \`newsletter\` DROP COLUMN \`cityFilter_backup\``,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert back to string format
        await queryRunner.query(
            `ALTER TABLE \`newsletter\` ADD \`cityFilter_backup\` varchar(255) NULL`,
        );

        // Convert array back to string (take first element)
        await queryRunner.query(`
            UPDATE \`newsletter\`
            SET \`cityFilter_backup\` = JSON_UNQUOTE(JSON_EXTRACT(\`cityFilter\`, '$[0]'))
            WHERE \`cityFilter\` IS NOT NULL AND JSON_LENGTH(\`cityFilter\`) > 0
        `);

        // Drop JSON column and recreate string column
        await queryRunner.query(
            `ALTER TABLE \`newsletter\` DROP COLUMN \`cityFilter\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`newsletter\` ADD \`cityFilter\` varchar(255) NULL`,
        );

        // Restore data
        await queryRunner.query(
            `UPDATE \`newsletter\` SET \`cityFilter\` = \`cityFilter_backup\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`newsletter\` DROP COLUMN \`cityFilter_backup\``,
        );
    }
}
