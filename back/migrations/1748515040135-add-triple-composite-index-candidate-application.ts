import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTripleCompositeIndexCandidateApplication1748515040135
    implements MigrationInterface
{
    name = 'addTripleCompositeIndexCandidateApplication1748515040135';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE INDEX idx_status_disabled_creation ON \`candidate-applications\` (\`applyStatusId\`, \`disabled\`, \`creationDate\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX idx_status_disabled_creation ON \`candidate-applications\`
        `);
    }
}
