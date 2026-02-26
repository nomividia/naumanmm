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
exports.addCandidatePerformanceIndexes1763000000000 = void 0;
class addCandidatePerformanceIndexes1763000000000 {
    constructor() {
        this.name = 'addCandidatePerformanceIndexes1763000000000';
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
            yield createIndexIfNotExists('IDX_candidate_status_disabled', 'candidates', "CREATE INDEX `IDX_candidate_status_disabled` ON `candidates` (`candidateStatusId`, `disabled`)");
            yield createIndexIfNotExists('IDX_candidate_jobhoused', 'candidates', "CREATE INDEX `IDX_candidate_jobhoused` ON `candidates` (`isJobHoused`, `disabled`)");
            yield createIndexIfNotExists('IDX_candidate_disabled_creationdate', 'candidates', "CREATE INDEX `IDX_candidate_disabled_creationdate` ON `candidates` (`disabled`, `creationDate` DESC)");
            yield createIndexIfNotExists('IDX_candidate_status_date', 'candidates', "CREATE INDEX `IDX_candidate_status_date` ON `candidates` (`candidateStatusId`, `disabled`, `creationDate` DESC)");
            yield createIndexIfNotExists('IDX_address_candidateid', 'address', "CREATE INDEX `IDX_address_candidateid` ON `address` (`candidateId`)");
            yield createIndexIfNotExists('IDX_address_country', 'address', "CREATE INDEX `IDX_address_country` ON `address` (`country`, `candidateId`)");
            yield createIndexIfNotExists('IDX_address_city', 'address', "CREATE INDEX `IDX_address_city` ON `address` (`city`(100), `candidateId`)");
            yield createIndexIfNotExists('IDX_address_department', 'address', "CREATE INDEX `IDX_address_department` ON `address` (`department`, `candidateId`)");
            yield createIndexIfNotExists('IDX_address_postalcode', 'address', "CREATE INDEX `IDX_address_postalcode` ON `address` (`postalCode`(2), `candidateId`)");
            yield createIndexIfNotExists('IDX_candidate_current_job', 'candidate-current-jobs', "CREATE INDEX `IDX_candidate_current_job` ON `candidate-current-jobs` (`currentJobId`, `candidateId`)");
            yield createIndexIfNotExists('IDX_candidate_current_candidateid', 'candidate-current-jobs', "CREATE INDEX `IDX_candidate_current_candidateid` ON `candidate-current-jobs` (`candidateId`, `currentJobId`)");
            yield createIndexIfNotExists('IDX_candidate_consultant', 'candidates', "CREATE INDEX `IDX_candidate_consultant` ON `candidates` (`consultantId`, `disabled`)");
            yield createIndexIfNotExists('IDX_candidate_birthdate', 'candidates', "CREATE INDEX `IDX_candidate_birthdate` ON `candidates` (`birthDate`, `disabled`)");
            yield createIndexIfNotExists('IDX_candidate_available', 'candidates', "CREATE INDEX `IDX_candidate_available` ON `candidates` (`isAvailable`, `disabled`)");
            yield createIndexIfNotExists('IDX_candidate_language_code', 'candidate-language', "CREATE INDEX `IDX_candidate_language_code` ON `candidate-language` (`languageCode`, `candidateId`)");
            yield createIndexIfNotExists('IDX_candidate_country_code', 'candidate-country', "CREATE INDEX `IDX_candidate_country_code` ON `candidate-country` (`country`, `candidateId`)");
            yield createIndexIfNotExists('IDX_candidate_department_code', 'candidate-department', "CREATE INDEX `IDX_candidate_department_code` ON `candidate-department` (`department`, `candidateId`)");
            yield createIndexIfNotExists('IDX_candidate_contracts_type', 'candidate-contracts', "CREATE INDEX `IDX_candidate_contracts_type` ON `candidate-contracts` (`contractTypeId`, `candidateId`)");
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
            yield dropIndexIfExists('IDX_candidate_contracts_type', 'candidate-contracts');
            yield dropIndexIfExists('IDX_candidate_department_code', 'candidate-department');
            yield dropIndexIfExists('IDX_candidate_country_code', 'candidate-country');
            yield dropIndexIfExists('IDX_candidate_language_code', 'candidate-language');
            yield dropIndexIfExists('IDX_candidate_available', 'candidates');
            yield dropIndexIfExists('IDX_candidate_birthdate', 'candidates');
            yield dropIndexIfExists('IDX_candidate_consultant', 'candidates');
            yield dropIndexIfExists('IDX_candidate_current_candidateid', 'candidate-current-jobs');
            yield dropIndexIfExists('IDX_candidate_current_job', 'candidate-current-jobs');
            yield dropIndexIfExists('IDX_address_postalcode', 'address');
            yield dropIndexIfExists('IDX_address_department', 'address');
            yield dropIndexIfExists('IDX_address_city', 'address');
            yield dropIndexIfExists('IDX_address_country', 'address');
            yield dropIndexIfExists('IDX_address_candidateid', 'address');
            yield dropIndexIfExists('IDX_candidate_status_date', 'candidates');
            yield dropIndexIfExists('IDX_candidate_disabled_creationdate', 'candidates');
            yield dropIndexIfExists('IDX_candidate_jobhoused', 'candidates');
            yield dropIndexIfExists('IDX_candidate_status_disabled', 'candidates');
        });
    }
}
exports.addCandidatePerformanceIndexes1763000000000 = addCandidatePerformanceIndexes1763000000000;
//# sourceMappingURL=1763000000000-add-candidate-performance-indexes.js.map