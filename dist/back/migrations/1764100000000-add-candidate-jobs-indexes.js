"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCandidateJobsIndexes1764100000000 = void 0;
class addCandidateJobsIndexes1764100000000 {
    constructor() {
        this.name = 'addCandidateJobsIndexes1764100000000';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const createIndexIfNotExists = (indexName, tableName, createQuery) => __awaiter(this, void 0, void 0, function* () {
                const indexExists = yield queryRunner.query(`SELECT COUNT(*) as count FROM information_schema.statistics
                 WHERE table_schema = DATABASE()
                 AND table_name = '${tableName}'
                 AND index_name = '${indexName}'`);
                if (indexExists[0].count === 0) {
                    yield queryRunner.query(createQuery);
                }
            });
            yield createIndexIfNotExists('IDX_candidate_jobs_candidateid', 'candidate-jobs', "CREATE INDEX `IDX_candidate_jobs_candidateid` ON `candidate-jobs` (`candidateId`)");
            yield createIndexIfNotExists('IDX_candidate_jobs_jobid', 'candidate-jobs', "CREATE INDEX `IDX_candidate_jobs_jobid` ON `candidate-jobs` (`jobId`)");
            yield createIndexIfNotExists('IDX_candidate_jobs_jobreferenceid', 'candidate-jobs', "CREATE INDEX `IDX_candidate_jobs_jobreferenceid` ON `candidate-jobs` (`jobReferenceId`)");
            yield createIndexIfNotExists('IDX_address_jobreferenceid', 'address', "CREATE INDEX `IDX_address_jobreferenceid` ON `address` (`jobReferenceId`)");
            yield createIndexIfNotExists('IDX_candidate_licences_candidateid', 'candidate-licences', "CREATE INDEX `IDX_candidate_licences_candidateid` ON `candidate-licences` (`candidateId`)");
            yield createIndexIfNotExists('IDX_candidate_language_candidateid', 'candidate-language', "CREATE INDEX `IDX_candidate_language_candidateid` ON `candidate-language` (`candidateId`)");
            yield createIndexIfNotExists('IDX_candidate_childrens_candidateid', 'candidate-childrens', "CREATE INDEX `IDX_candidate_childrens_candidateid` ON `candidate-childrens` (`candidateId`)");
            yield createIndexIfNotExists('IDX_candidate_pets_candidateid', 'candidate-pets', "CREATE INDEX `IDX_candidate_pets_candidateid` ON `candidate-pets` (`candidateId`)");
            yield createIndexIfNotExists('IDX_note_items_candidateid', 'note-items', "CREATE INDEX `IDX_note_items_candidateid` ON `note-items` (`candidateId`)");
            yield createIndexIfNotExists('IDX_users_candidateid', 'users', "CREATE INDEX `IDX_users_candidateid` ON `users` (`candidateId`)");
            yield createIndexIfNotExists('IDX_app_value_translations_appvalueid', 'app-value-translations', "CREATE INDEX `IDX_app_value_translations_appvalueid` ON `app-value-translations` (`appValueId`)");
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const dropIndexIfExists = (indexName, tableName) => __awaiter(this, void 0, void 0, function* () {
                const indexExists = yield queryRunner.query(`SELECT COUNT(*) as count FROM information_schema.statistics
                 WHERE table_schema = DATABASE()
                 AND table_name = '${tableName}'
                 AND index_name = '${indexName}'`);
                if (indexExists[0].count > 0) {
                    yield queryRunner.query(`DROP INDEX \`${indexName}\` ON \`${tableName}\``);
                }
            });
            yield dropIndexIfExists('IDX_app_value_translations_appvalueid', 'app-value-translations');
            yield dropIndexIfExists('IDX_users_candidateid', 'users');
            yield dropIndexIfExists('IDX_note_items_candidateid', 'note-items');
            yield dropIndexIfExists('IDX_candidate_pets_candidateid', 'candidate-pets');
            yield dropIndexIfExists('IDX_candidate_childrens_candidateid', 'candidate-childrens');
            yield dropIndexIfExists('IDX_candidate_language_candidateid', 'candidate-language');
            yield dropIndexIfExists('IDX_candidate_licences_candidateid', 'candidate-licences');
            yield dropIndexIfExists('IDX_address_jobreferenceid', 'address');
            yield dropIndexIfExists('IDX_candidate_jobs_jobreferenceid', 'candidate-jobs');
            yield dropIndexIfExists('IDX_candidate_jobs_jobid', 'candidate-jobs');
            yield dropIndexIfExists('IDX_candidate_jobs_candidateid', 'candidate-jobs');
        });
    }
}
exports.addCandidateJobsIndexes1764100000000 = addCandidateJobsIndexes1764100000000;
//# sourceMappingURL=1764100000000-add-candidate-jobs-indexes.js.map