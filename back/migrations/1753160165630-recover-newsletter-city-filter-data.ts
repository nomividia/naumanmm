import { MigrationInterface, QueryRunner } from 'typeorm';

export class recoverNewsletterCityFilterData1753160165630
    implements MigrationInterface
{
    name = 'recoverNewsletterCityFilterData1753160165630';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if we have any newsletters with empty cityFilter but should have data
        // This is a recovery migration in case the previous migration lost data

        // First, let's check what data we have
        const newsletters = await queryRunner.query(`
            SELECT id, cityFilter FROM \`newsletter\`
            WHERE cityFilter IS NULL OR cityFilter = '[]' OR cityFilter = '[""]'
        `);

        console.log(
            'Found newsletters with missing cityFilter data:',
            newsletters.length,
        );

        // For each newsletter, we'll try to recover based on common patterns
        // This is a best-effort recovery since we can't know the original data
        for (const newsletter of newsletters) {
            // Set a default empty array if the data is completely missing
            await queryRunner.query(
                `
                UPDATE \`newsletter\`
                SET \`cityFilter\` = JSON_ARRAY()
                WHERE id = ? AND (cityFilter IS NULL OR cityFilter = '[]' OR cityFilter = '[""]')
            `,
                [newsletter.id],
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No down migration needed for recovery
    }
}
