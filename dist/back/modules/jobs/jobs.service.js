"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const typeorm_2 = require("typeorm");
const constants_1 = require("../../environment/constants");
const environment_1 = require("../../environment/environment");
const app_error_1 = require("../../models/app-error");
const generic_response_1 = require("../../models/responses/generic-response");
const base_model_service_1 = require("../../services/base-model.service");
const pm2_helpers_1 = require("../../services/pm2-helpers");
const helpers_service_1 = require("../../services/tools/helpers.service");
const initial_jobs_1 = require("../../services/tools/initial-jobs");
const logger_service_1 = require("../../services/tools/logger.service");
const redis_manager_1 = require("../../services/tools/redis.manager");
const firebase_service_1 = require("../firebase/firebase-service");
const notifications_service_1 = require("../notifications/notifications.service");
const job_history_entity_1 = require("./job-history.entity");
const job_entity_1 = require("./job.entity");
const jobs_responses_1 = require("./jobs-responses");
const CronJob = require('cron').CronJob;
let JobsService = class JobsService extends base_model_service_1.ApplicationBaseModelService {
    constructor(jobsRepository, jobHistoryRepository, appLogger, moduleRef, notificationsService, lazyModuleLoader) {
        super();
        this.jobsRepository = jobsRepository;
        this.jobHistoryRepository = jobHistoryRepository;
        this.appLogger = appLogger;
        this.moduleRef = moduleRef;
        this.notificationsService = notificationsService;
        this.lazyModuleLoader = lazyModuleLoader;
        this.runningJobs = [];
        this.modelOptions = {
            getManyResponse: jobs_responses_1.GetJobsResponse,
            getOneResponse: jobs_responses_1.GetJobResponse,
            getManyResponseField: 'jobs',
            getOneResponseField: 'job',
            repository: this.jobsRepository,
            entity: job_entity_1.Job,
        };
    }
    findAll(conditions, includeFirstJobHistory) {
        const _super = Object.create(null, {
            findAll: { get: () => super.findAll }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield _super.findAll.call(this, conditions);
            if (response.success && includeFirstJobHistory) {
                for (const job of response.jobs) {
                    const jhResponse = yield this.jobHistoryRepository.findOne({
                        where: { jobId: job.id },
                        order: { date: 'DESC' },
                    });
                    if (jhResponse) {
                        job.jobHistory = [jhResponse];
                    }
                }
            }
            response.isOnMainWorker = helpers_service_1.ApiMainHelpers.isMainWorker();
            return response;
        });
    }
    findAllOptimize(conditions) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new jobs_responses_1.GetJobsResponse();
            try {
                let where = '';
                let orderBy = '';
                let limit = '';
                if (conditions) {
                    if (conditions.where && conditions.where['enabled']) {
                        where = ' WHERE enabled=1 ';
                    }
                    if (conditions.order) {
                        const key = Object.keys(conditions.order)[0];
                        orderBy =
                            ' ORDER BY ' + key + ' ' + conditions.order[key] + ' ';
                    }
                    if (conditions.skip != null && conditions.take) {
                        limit +=
                            ' LIMIT ' + conditions.skip + ', ' + conditions.take;
                    }
                }
                const query = `
            SELECT jobs.*, jobsHistory.date as jobsHistory_date, jobsHistory.id as jobsHistory_id
            FROM jobs
            LEFT JOIN LATERAL (SELECT *
                               FROM \`jobs-history\`
                               WHERE jobId = jobs.id
                               ORDER BY date desc
                               LIMIT 1) as jobsHistory
                ON jobs.id = jobsHistory.jobId${where}${orderBy}${limit};`;
                const jobs = (yield this.jobsRepository.query(query));
                if (jobs && jobs.length > 0) {
                    response.jobs = jobs.map((x) => {
                        const jobEntity = new job_entity_1.Job();
                        jobEntity.fromDto(x);
                        const jobDto = jobEntity.toDto();
                        const jhId = x['jobsHistory_id'];
                        const jhDate = x['jobsHistory_date'];
                        if (jhId) {
                            jobDto.jobHistory = [
                                {
                                    id: jhId,
                                    job: undefined,
                                    jobId: undefined,
                                    date: jhDate,
                                },
                            ];
                        }
                        return jobDto;
                    });
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    createOrUpdate(job) {
        const _super = Object.create(null, {
            createOrUpdate: { get: () => super.createOrUpdate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const updateResponse = yield _super.createOrUpdate.call(this, job);
            if (updateResponse.success) {
                this.triggerPlanJobs();
            }
            updateResponse.isOnMainWorker = helpers_service_1.ApiMainHelpers.isMainWorker();
            return updateResponse;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!helpers_service_1.ApiMainHelpers.isMainWorker()) {
                return;
            }
            if (pm2_helpers_1.PM2Helpers.enabled) {
                pm2_helpers_1.PM2Helpers.onPM2Data.subscribe((data) => {
                    if (data.eventName === 'PlanJobs') {
                        this.planJobs();
                    }
                });
            }
            else {
                redis_manager_1.RedisManager.onMessage('PlanJobs').subscribe(() => {
                    this.planJobs();
                });
            }
            yield this.createInitialJobsIfNeeded();
            yield this.planJobs();
        });
    }
    planJobs() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!helpers_service_1.ApiMainHelpers.isMainWorker()) {
                return;
            }
            console.log('replanning all jobs...');
            this.stopAllJobsAndClearRunningJobs();
            const getJobsResponse = yield this.findAll({
                where: { enabled: true, cronPattern: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()) },
            });
            if (!getJobsResponse.success) {
                return;
            }
            for (const jobDto of getJobsResponse.jobs) {
                if (!jobDto.cronPattern) {
                    continue;
                }
                const jobDesc = this.getJobDescription(jobDto);
                const job = new CronJob(jobDto.cronPattern, () => __awaiter(this, void 0, void 0, function* () {
                    yield this.executeJob(jobDto);
                }));
                job.start();
                yield this.appLogger.log('scheduling job ' + jobDesc + ' ...');
                this.runningJobs.push({ cronJobObject: job, jobId: jobDto.id });
            }
        });
    }
    getJobDescription(jobEntity) {
        return ' "' + jobEntity.name + '" (id=' + jobEntity.id + ')';
    }
    executeJob(jobDto) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let jobResponse = new generic_response_1.GenericResponse();
            const jobDesc = this.getJobDescription(jobDto);
            try {
                if (constants_1.maintenanceMode) {
                    jobResponse.success = true;
                    return jobResponse;
                }
                const jobEntity = yield this.getRepository().findOne({
                    where: { id: jobDto.id },
                    select: ['id', 'enabled'],
                });
                if (!jobEntity.enabled) {
                    yield this.appLogger.log('prevent running disabled job ' + jobDesc + ' ...');
                    jobResponse.success = true;
                    return jobResponse;
                }
                if (!jobDto.modulePath) {
                    throw new Error('You must specify module path !');
                }
                if (!jobDto.servicePath) {
                    throw new Error('You must specify service path !');
                }
                const importedModule = yield Promise.resolve().then(() => require(jobDto.modulePath));
                if (!importedModule) {
                    throw new Error('Module ' +
                        jobDto.modulePath +
                        ' not found - invalid path !');
                }
                let moduleName = jobDto.moduleName;
                if (!moduleName) {
                    moduleName = (_a = Object.keys(importedModule)) === null || _a === void 0 ? void 0 : _a[0];
                }
                if (!moduleName) {
                    throw new Error('Module ' + jobDto.modulePath + ' not found !');
                }
                const moduleRef = yield this.lazyModuleLoader.load(() => importedModule[moduleName]);
                if (!moduleRef) {
                    throw new Error('Module ' +
                        moduleName +
                        ' not found : moduleRef undefined !');
                }
                const importedService = yield Promise.resolve().then(() => require(jobDto.servicePath));
                if (!importedService) {
                    throw new Error('Service ' +
                        jobDto.servicePath +
                        ' not found - invalid path !');
                }
                let serviceName = jobDto.applicationServiceName;
                if (!serviceName) {
                    serviceName = (_b = Object.keys(importedService)) === null || _b === void 0 ? void 0 : _b[0];
                }
                if (!serviceName) {
                    throw new Error('Service ' + jobDto.servicePath + ' not found !');
                }
                const service = moduleRef.get(importedService[serviceName]);
                if (!service) {
                    throw new Error('Service ' +
                        serviceName +
                        ' not found : service undefined !');
                }
                const method = service[jobDto.methodName];
                if (typeof method !== 'function') {
                    throw new Error('Unable to run job ' + jobDesc + ' -> no method found !');
                }
                if (jobDto.logHistory) {
                    yield this.appLogger.log('Running job ' + jobDesc + ' ...');
                }
                const start = new Date();
                if (jobDto.logHistory) {
                    yield this.appLogger.log('calling job method ' + jobDto.methodName + ' ...');
                }
                jobResponse = (yield method.call(service));
                if (jobDto.logHistory) {
                    const end = new Date();
                    const newJobHistory = new job_history_entity_1.JobHistory();
                    newJobHistory.date = new Date();
                    newJobHistory.jobId = jobDto.id;
                    newJobHistory.duration = end.getTime() - start.getTime();
                    if (jobResponse) {
                        newJobHistory.result = JSON.stringify(jobResponse);
                    }
                    yield this.jobHistoryRepository.save(newJobHistory);
                }
            }
            catch (err) {
                yield this.appLogger.error('Unable to run job ' + jobDesc);
                jobResponse.handleError(err);
            }
            return jobResponse;
        });
    }
    triggerPlanJobs() {
        if (helpers_service_1.ApiMainHelpers.isMainWorker()) {
            this.planJobs();
            return;
        }
        if (pm2_helpers_1.PM2Helpers.enabled) {
            pm2_helpers_1.PM2Helpers.sendDataToAllAppProcesses({ eventName: 'PlanJobs' }, true);
        }
        else {
            redis_manager_1.RedisManager.send('PlanJobs');
        }
    }
    deleteJobs(jobIds) {
        const _super = Object.create(null, {
            delete: { get: () => super.delete }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield _super.delete.call(this, jobIds);
            if (response.success) {
                this.triggerPlanJobs();
            }
            return response;
        });
    }
    triggerJob(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new generic_response_1.GenericResponse();
            try {
                const job = yield this.jobsRepository.findOne({
                    where: { id: jobId },
                });
                if (!job) {
                    throw new app_error_1.AppError('triggerJob - job not found id=' + jobId);
                }
                response = yield this.executeJob(job.toDto());
            }
            catch (err) {
                response.error = err;
            }
            return response;
        });
    }
    deleteOldJobHistoryAndLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new generic_response_1.GenericResponse();
            try {
                yield this.appLogger.log('Main clean - Début du job');
                response = yield this.deleteOldJobHistory();
                if (response.success) {
                    const ok = yield this.appLogger.cleanLogs();
                    response.success = ok;
                }
                yield firebase_service_1.FirebaseService.cleanOldConnections();
                yield firebase_service_1.FirebaseService.cleanOldNotifications();
                yield this.notificationsService.cleanOldNotifications();
                if (!environment_1.Environment.PreserveFilesInTempDirectory) {
                    yield this.cleanOldFilesInTempDirectory();
                }
            }
            catch (err) {
                response.error = err;
            }
            yield this.appLogger.log('Main clean - Fin du job');
            return response;
        });
    }
    cleanOldFilesInTempDirectory() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let result = true;
            try {
                const now = new Date();
                let removeCounter = 0;
                const tempFolders = [
                    environment_1.Environment.UploadedFilesTempDirectory,
                    environment_1.Environment.PublicTempFolder,
                ];
                for (const tempFolder of tempFolders) {
                    const filesInTempFolder = yield nextalys_node_helpers_1.FileHelpers.getFilesInFolder(tempFolder, { returnFullPath: true });
                    for (const fileFullPath of filesInTempFolder) {
                        const fileInfo = yield nextalys_node_helpers_1.FileHelpers.getFileInfo(fileFullPath);
                        if (!(fileInfo === null || fileInfo === void 0 ? void 0 : fileInfo.success) || !((_a = fileInfo.data) === null || _a === void 0 ? void 0 : _a.mtime)) {
                            continue;
                        }
                        if (nextalys_js_helpers_1.DateHelpers.daysDiff(fileInfo.data.mtime, now) > 30) {
                            yield nextalys_node_helpers_1.FileHelpers.removeFile(fileFullPath);
                            removeCounter++;
                        }
                    }
                }
                yield this.appLogger.log('Suppression des fichiers temporaires terminée - nombre de fichiers supprimés ', removeCounter);
            }
            catch (err) {
                result = false;
                yield this.appLogger.error('Erreur lors de la suppression des fichiers temporaires', err);
            }
            return result;
        });
    }
    deleteOldJobHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const maxHistory = 50;
                const jobs = yield this.jobsRepository.find();
                const jhToRemove = [];
                for (const job of jobs) {
                    const jhList = yield this.jobHistoryRepository.find({
                        select: ['id'],
                        where: { jobId: job.id },
                        skip: maxHistory,
                        take: 10000,
                        order: { date: 'DESC' },
                    });
                    if (jhList.length > 0) {
                        jhToRemove.push(...jhList.map((x) => x.id));
                    }
                }
                if (jhToRemove.length > 0) {
                    this.jobHistoryRepository.delete(jhToRemove);
                }
                response.success = true;
            }
            catch (err) {
                response.error = err;
            }
            return response;
        });
    }
    createInitialJobsIfNeeded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!helpers_service_1.ApiMainHelpers.isMainWorker()) {
                return;
            }
            for (const jobDto of initial_jobs_1.GlobalInitialJobs) {
                let jobEntity = yield this.jobsRepository.findOne({
                    where: { id: jobDto.id },
                });
                if (jobEntity) {
                    continue;
                }
                jobEntity = new job_entity_1.Job();
                jobEntity.fromDto(jobDto);
                yield this.jobsRepository.save(jobEntity);
            }
        });
    }
    stopAllJobsAndClearRunningJobs() {
        if (!this.runningJobs) {
            return;
        }
        for (const job of this.runningJobs) {
            job.cronJobObject.stop();
        }
        this.runningJobs = [];
    }
    stopDisabledJobs() {
        return __awaiter(this, void 0, void 0, function* () {
            const getJobsResponse = yield this.findAll({
                where: { enabled: false },
            });
            if (!getJobsResponse.success) {
                return;
            }
            for (const jobEntity of getJobsResponse.jobs) {
                const jobObjectWrapperIndex = this.runningJobs.findIndex((x) => x.jobId === jobEntity.id);
                if (jobObjectWrapperIndex !== -1) {
                    this.runningJobs[jobObjectWrapperIndex].cronJobObject.stop();
                    this.runningJobs.splice(jobObjectWrapperIndex, 1);
                }
            }
        });
    }
};
JobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(1, (0, typeorm_1.InjectRepository)(job_history_entity_1.JobHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        logger_service_1.AppLogger,
        core_1.ModuleRef,
        notifications_service_1.NotificationsService,
        core_1.LazyModuleLoader])
], JobsService);
exports.JobsService = JobsService;
//# sourceMappingURL=jobs.service.js.map