import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPlacementFieldsToHistory1770818043780 implements MigrationInterface {
    name = 'addPlacementFieldsToHistory1770818043780';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add startDate column if it doesn't already exist
        const startDateExists = await queryRunner.query(
            `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'candidate-job-offer-history' AND COLUMN_NAME = 'startDate'`,
        );
        if (startDateExists[0].cnt === 0) {
            await queryRunner.query(
                `ALTER TABLE \`candidate-job-offer-history\` ADD \`startDate\` date NULL`,
            );
        }

        // Add contractFileId column if it doesn't already exist
        const contractFileIdExists = await queryRunner.query(
            `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'candidate-job-offer-history' AND COLUMN_NAME = 'contractFileId'`,
        );
        if (contractFileIdExists[0].cnt === 0) {
            await queryRunner.query(
                `ALTER TABLE \`candidate-job-offer-history\` ADD \`contractFileId\` varchar(36) NULL`,
            );
        }

        // Add FK constraint if it doesn't already exist
        const fkExists = await queryRunner.query(
            `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'candidate-job-offer-history' AND CONSTRAINT_NAME = 'FK_placement_contract_file'`,
        );
        if (fkExists[0].cnt === 0) {
            await queryRunner.query(
                `ALTER TABLE \`candidate-job-offer-history\` ADD CONSTRAINT \`FK_placement_contract_file\` FOREIGN KEY (\`contractFileId\`) REFERENCES \`candidates-files\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
            );
        }

        // Insert app-value if it doesn't already exist
        const appValueExists = await queryRunner.query(
            `SELECT COUNT(*) as cnt FROM \`app_values\` WHERE \`code\` = 'CandidateFileType_PlacementContract'`,
        );
        if (appValueExists[0].cnt === 0) {
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
        await queryRunner.query(
            `ALTER TABLE \`candidate-job-offer-history\` DROP FOREIGN KEY \`FK_placement_contract_file\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`candidate-job-offer-history\` DROP COLUMN \`contractFileId\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`candidate-job-offer-history\` DROP COLUMN \`startDate\``,
        );
    }
}
