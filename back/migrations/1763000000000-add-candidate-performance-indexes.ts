import { MigrationInterface, QueryRunner } from "typeorm";

export class addCandidatePerformanceIndexes1763000000000 implements MigrationInterface {
    name = 'addCandidatePerformanceIndexes1763000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Helper function to create index only if it doesn't exist
        const createIndexIfNotExists = async (indexName: string, tableName: string, createQuery: string) => {
            const indexExists = await queryRunner.query(
                `SELECT COUNT(*) as count FROM information_schema.statistics
                 WHERE table_schema = DATABASE()
                 AND table_name = '${tableName}'
                 AND index_name = '${indexName}'`
            );

            if (indexExists[0].count === 0) {
                await queryRunner.query(createQuery);
            }
        };

        // Indexes on candidates table for most common filters
        await createIndexIfNotExists(
            'IDX_candidate_status_disabled',
            'candidates',
            "CREATE INDEX `IDX_candidate_status_disabled` ON `candidates` (`candidateStatusId`, `disabled`)"
        );
        await createIndexIfNotExists(
            'IDX_candidate_jobhoused',
            'candidates',
            "CREATE INDEX `IDX_candidate_jobhoused` ON `candidates` (`isJobHoused`, `disabled`)"
        );
        await createIndexIfNotExists(
            'IDX_candidate_disabled_creationdate',
            'candidates',
            "CREATE INDEX `IDX_candidate_disabled_creationdate` ON `candidates` (`disabled`, `creationDate` DESC)"
        );

        // Composite index for status + sorting (very common use case)
        await createIndexIfNotExists(
            'IDX_candidate_status_date',
            'candidates',
            "CREATE INDEX `IDX_candidate_status_date` ON `candidates` (`candidateStatusId`, `disabled`, `creationDate` DESC)"
        );

        // Indexes on address table for city/country filters
        await createIndexIfNotExists(
            'IDX_address_candidateid',
            'address',
            "CREATE INDEX `IDX_address_candidateid` ON `address` (`candidateId`)"
        );
        await createIndexIfNotExists(
            'IDX_address_country',
            'address',
            "CREATE INDEX `IDX_address_country` ON `address` (`country`, `candidateId`)"
        );
        // Partial index for city (first 100 chars) since it's VARCHAR and used with LIKE
        await createIndexIfNotExists(
            'IDX_address_city',
            'address',
            "CREATE INDEX `IDX_address_city` ON `address` (`city`(100), `candidateId`)"
        );
        await createIndexIfNotExists(
            'IDX_address_department',
            'address',
            "CREATE INDEX `IDX_address_department` ON `address` (`department`, `candidateId`)"
        );
        // Index for postal code substring matching
        await createIndexIfNotExists(
            'IDX_address_postalcode',
            'address',
            "CREATE INDEX `IDX_address_postalcode` ON `address` (`postalCode`(2), `candidateId`)"
        );

        // Indexes on candidate-current-jobs table for job filters
        await createIndexIfNotExists(
            'IDX_candidate_current_job',
            'candidate-current-jobs',
            "CREATE INDEX `IDX_candidate_current_job` ON `candidate-current-jobs` (`currentJobId`, `candidateId`)"
        );
        await createIndexIfNotExists(
            'IDX_candidate_current_candidateid',
            'candidate-current-jobs',
            "CREATE INDEX `IDX_candidate_current_candidateid` ON `candidate-current-jobs` (`candidateId`, `currentJobId`)"
        );

        // Additional useful indexes for other common filters
        await createIndexIfNotExists(
            'IDX_candidate_consultant',
            'candidates',
            "CREATE INDEX `IDX_candidate_consultant` ON `candidates` (`consultantId`, `disabled`)"
        );
        await createIndexIfNotExists(
            'IDX_candidate_birthdate',
            'candidates',
            "CREATE INDEX `IDX_candidate_birthdate` ON `candidates` (`birthDate`, `disabled`)"
        );
        await createIndexIfNotExists(
            'IDX_candidate_available',
            'candidates',
            "CREATE INDEX `IDX_candidate_available` ON `candidates` (`isAvailable`, `disabled`)"
        );

        // Indexes for related tables used in subqueries
        await createIndexIfNotExists(
            'IDX_candidate_language_code',
            'candidate-language',
            "CREATE INDEX `IDX_candidate_language_code` ON `candidate-language` (`languageCode`, `candidateId`)"
        );
        await createIndexIfNotExists(
            'IDX_candidate_country_code',
            'candidate-country',
            "CREATE INDEX `IDX_candidate_country_code` ON `candidate-country` (`country`, `candidateId`)"
        );
        await createIndexIfNotExists(
            'IDX_candidate_department_code',
            'candidate-department',
            "CREATE INDEX `IDX_candidate_department_code` ON `candidate-department` (`department`, `candidateId`)"
        );
        await createIndexIfNotExists(
            'IDX_candidate_contracts_type',
            'candidate-contracts',
            "CREATE INDEX `IDX_candidate_contracts_type` ON `candidate-contracts` (`contractTypeId`, `candidateId`)"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Helper function to drop index only if it exists
        const dropIndexIfExists = async (indexName: string, tableName: string) => {
            const indexExists = await queryRunner.query(
                `SELECT COUNT(*) as count FROM information_schema.statistics
                 WHERE table_schema = DATABASE()
                 AND table_name = '${tableName}'
                 AND index_name = '${indexName}'`
            );

            if (indexExists[0].count > 0) {
                await queryRunner.query(`DROP INDEX \`${indexName}\` ON \`${tableName}\``);
            }
        };

        // Drop all indexes in reverse order
        await dropIndexIfExists('IDX_candidate_contracts_type', 'candidate-contracts');
        await dropIndexIfExists('IDX_candidate_department_code', 'candidate-department');
        await dropIndexIfExists('IDX_candidate_country_code', 'candidate-country');
        await dropIndexIfExists('IDX_candidate_language_code', 'candidate-language');

        await dropIndexIfExists('IDX_candidate_available', 'candidates');
        await dropIndexIfExists('IDX_candidate_birthdate', 'candidates');
        await dropIndexIfExists('IDX_candidate_consultant', 'candidates');

        await dropIndexIfExists('IDX_candidate_current_candidateid', 'candidate-current-jobs');
        await dropIndexIfExists('IDX_candidate_current_job', 'candidate-current-jobs');

        await dropIndexIfExists('IDX_address_postalcode', 'address');
        await dropIndexIfExists('IDX_address_department', 'address');
        await dropIndexIfExists('IDX_address_city', 'address');
        await dropIndexIfExists('IDX_address_country', 'address');
        await dropIndexIfExists('IDX_address_candidateid', 'address');

        await dropIndexIfExists('IDX_candidate_status_date', 'candidates');
        await dropIndexIfExists('IDX_candidate_disabled_creationdate', 'candidates');
        await dropIndexIfExists('IDX_candidate_jobhoused', 'candidates');
        await dropIndexIfExists('IDX_candidate_status_disabled', 'candidates');
    }
}
