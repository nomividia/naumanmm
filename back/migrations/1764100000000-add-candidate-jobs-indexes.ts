import { MigrationInterface, QueryRunner } from "typeorm";

export class addCandidateJobsIndexes1764100000000 implements MigrationInterface {
    name = 'addCandidateJobsIndexes1764100000000';

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

        // Index on candidate-jobs for candidateId (critical for loading candidate jobs efficiently)
        await createIndexIfNotExists(
            'IDX_candidate_jobs_candidateid',
            'candidate-jobs',
            "CREATE INDEX `IDX_candidate_jobs_candidateid` ON `candidate-jobs` (`candidateId`)"
        );

        // Index on candidate-jobs for jobId (for job filtering)
        await createIndexIfNotExists(
            'IDX_candidate_jobs_jobid',
            'candidate-jobs',
            "CREATE INDEX `IDX_candidate_jobs_jobid` ON `candidate-jobs` (`jobId`)"
        );

        // Index on candidate-jobs for jobReferenceId (for loading job references)
        await createIndexIfNotExists(
            'IDX_candidate_jobs_jobreferenceid',
            'candidate-jobs',
            "CREATE INDEX `IDX_candidate_jobs_jobreferenceid` ON `candidate-jobs` (`jobReferenceId`)"
        );

        // Index on job-references id (should exist as PK, but ensure composite for addresses)
        await createIndexIfNotExists(
            'IDX_address_jobreferenceid',
            'address',
            "CREATE INDEX `IDX_address_jobreferenceid` ON `address` (`jobReferenceId`)"
        );

        // Index on candidate-licences for candidateId
        await createIndexIfNotExists(
            'IDX_candidate_licences_candidateid',
            'candidate-licences',
            "CREATE INDEX `IDX_candidate_licences_candidateid` ON `candidate-licences` (`candidateId`)"
        );

        // Index on candidate-language for candidateId
        await createIndexIfNotExists(
            'IDX_candidate_language_candidateid',
            'candidate-language',
            "CREATE INDEX `IDX_candidate_language_candidateid` ON `candidate-language` (`candidateId`)"
        );

        // Index on candidate-childrens for candidateId
        await createIndexIfNotExists(
            'IDX_candidate_childrens_candidateid',
            'candidate-childrens',
            "CREATE INDEX `IDX_candidate_childrens_candidateid` ON `candidate-childrens` (`candidateId`)"
        );

        // Index on candidate-pets for candidateId
        await createIndexIfNotExists(
            'IDX_candidate_pets_candidateid',
            'candidate-pets',
            "CREATE INDEX `IDX_candidate_pets_candidateid` ON `candidate-pets` (`candidateId`)"
        );

        // Index on note-items for candidateId
        await createIndexIfNotExists(
            'IDX_note_items_candidateid',
            'note-items',
            "CREATE INDEX `IDX_note_items_candidateid` ON `note-items` (`candidateId`)"
        );

        // Index on users for candidateId (used in findOneWithRequest to find associated user)
        await createIndexIfNotExists(
            'IDX_users_candidateid',
            'users',
            "CREATE INDEX `IDX_users_candidateid` ON `users` (`candidateId`)"
        );

        // Index on app-value-translations for appValueId (critical for translation loading)
        await createIndexIfNotExists(
            'IDX_app_value_translations_appvalueid',
            'app-value-translations',
            "CREATE INDEX `IDX_app_value_translations_appvalueid` ON `app-value-translations` (`appValueId`)"
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
        await dropIndexIfExists('IDX_app_value_translations_appvalueid', 'app-value-translations');
        await dropIndexIfExists('IDX_users_candidateid', 'users');
        await dropIndexIfExists('IDX_note_items_candidateid', 'note-items');
        await dropIndexIfExists('IDX_candidate_pets_candidateid', 'candidate-pets');
        await dropIndexIfExists('IDX_candidate_childrens_candidateid', 'candidate-childrens');
        await dropIndexIfExists('IDX_candidate_language_candidateid', 'candidate-language');
        await dropIndexIfExists('IDX_candidate_licences_candidateid', 'candidate-licences');
        await dropIndexIfExists('IDX_address_jobreferenceid', 'address');
        await dropIndexIfExists('IDX_candidate_jobs_jobreferenceid', 'candidate-jobs');
        await dropIndexIfExists('IDX_candidate_jobs_jobid', 'candidate-jobs');
        await dropIndexIfExists('IDX_candidate_jobs_candidateid', 'candidate-jobs');
    }
}
