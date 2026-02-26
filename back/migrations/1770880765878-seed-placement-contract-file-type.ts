import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedPlacementContractFileType1770880765878 implements MigrationInterface {
    name = 'seedPlacementContractFileType1770880765878';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const exists = await queryRunner.query(
            `SELECT COUNT(*) as cnt FROM \`app_values\` WHERE \`code\` = 'CandidateFileType_PlacementContract'`,
        );
        if (exists[0].cnt === 0) {
            // Resolve the appTypeId for CandidateFileType from an existing row
            const [existingType] = await queryRunner.query(
                `SELECT \`appTypeId\` FROM \`app_values\` WHERE \`code\` LIKE 'CandidateFileType_%' LIMIT 1`,
            );
            const appTypeId = existingType?.appTypeId;
            if (appTypeId) {
                await queryRunner.query(
                    `INSERT INTO \`app_values\` (\`id\`, \`label\`, \`enabled\`, \`code\`, \`appTypeId\`, \`order\`) VALUES (UUID(), 'Placement Contract', 1, 'CandidateFileType_PlacementContract', '${appTypeId}', 99)`,
                );
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM \`app_values\` WHERE \`code\` = 'CandidateFileType_PlacementContract'`,
        );
    }
}
