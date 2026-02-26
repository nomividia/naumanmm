import { Injectable } from '@nestjs/common';
import { LazyModuleLoader, ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { DateHelpers } from 'nextalys-js-helpers';
import { FileHelpers } from 'nextalys-node-helpers';
import { FindManyOptions, IsNull, Not, Repository } from 'typeorm';
import { maintenanceMode } from '../../environment/constants';
import { Environment } from '../../environment/environment';
import { AppError } from '../../models/app-error';
import { GenericResponse } from '../../models/responses/generic-response';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { PM2Helpers } from '../../services/pm2-helpers';
import { ApiMainHelpers } from '../../services/tools/helpers.service';
import { GlobalInitialJobs } from '../../services/tools/initial-jobs';
import { AppLogger } from '../../services/tools/logger.service';
import { RedisManager } from '../../services/tools/redis.manager';
import { CronJobObject, CronObjectConstructor } from '../../shared/types';
import { FirebaseService } from '../firebase/firebase-service';
import { NotificationsService } from '../notifications/notifications.service';
import { JobDto } from './job-dto';
import { JobHistory } from './job-history.entity';
import { Job } from './job.entity';
import { GetJobResponse, GetJobsResponse } from './jobs-responses';

const CronJob = require('cron').CronJob as CronObjectConstructor;

@Injectable()
export class JobsService extends ApplicationBaseModelService<
    Job,
    JobDto,
    GetJobResponse,
    GetJobsResponse
> {
    public runningJobs: { jobId: string; cronJobObject: CronJobObject }[] = [];

    constructor(
        @InjectRepository(Job)
        private readonly jobsRepository: Repository<Job>,
        @InjectRepository(JobHistory)
        private readonly jobHistoryRepository: Repository<JobHistory>,
        private appLogger: AppLogger,
        private readonly moduleRef: ModuleRef,
        private readonly notificationsService: NotificationsService,
        private lazyModuleLoader: LazyModuleLoader,
    ) {
        super();

        this.modelOptions = {
            getManyResponse: GetJobsResponse as any,
            getOneResponse: GetJobResponse as any,
            getManyResponseField: 'jobs',
            getOneResponseField: 'job',
            repository: this.jobsRepository,
            entity: Job as any,
        };
    }
    async findAll(
        conditions?: FindManyOptions<Job>,
        includeFirstJobHistory?: boolean,
    ): Promise<GetJobsResponse> {
        const response = await super.findAll(conditions);

        if (response.success && includeFirstJobHistory) {
            for (const job of response.jobs) {
                const jhResponse = await this.jobHistoryRepository.findOne({
                    where: { jobId: job.id },
                    order: { date: 'DESC' },
                });

                if (jhResponse) {
                    job.jobHistory = [jhResponse];
                }
            }
        }

        response.isOnMainWorker = ApiMainHelpers.isMainWorker();

        return response;
    }

    async findAllOptimize(
        conditions?: FindManyOptions<Job>,
    ): Promise<GetJobsResponse> {
        const response = new GetJobsResponse();

        try {
            // const loadedPost = await this.jobsRepository
            //     .createQueryBuilder("job")
            //     // .leftJoinAndMapOne("jobs.jobHistory", JobHistory, "jobHistory", "jobs.id = jobHistory.jobId")
            //     .leftJoinAndMapMany("jobHistory", subQuery => {
            //         // return this.jobHistoryRepository.createQueryBuilder('jobHistory').orderBy('jobHistory.date', 'DESC').limit(1);
            //         return subQuery
            //             .select()
            //             .from(JobHistory, 'jobs-history')
            //             .orderBy('"date"', 'DESC').limit(1)
            //     }, 'jh', 'jh.jobId = job.id')
            //     .getMany();
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

            //WHEN @job_id COLLATE utf8mb4_general_ci = jobId
            //compatible with mysql 5.5
            //             const query = `SELECT j.*,  jh.id as jobsHistory_id,jh.date as jobsHistory_date
            // FROM jobs as j
            // LEFT JOIN (SELECT c.*,
            //         @row_number:=CASE WHEN @job_id = jobId
            //                           THEN @row_number + 1
            //                           ELSE 1
            //                      END AS rcount,
            //         @job_id := jobId
            //     FROM \`jobs-history\` as c
            //     CROSS JOIN (select @row_number := 1) as x
            //     CROSS JOIN (select @job_id := -1) as y
            //     ORDER BY date desc
            // ) as jh
            //     ON j.id = jh.jobId
            //     AND jh.rcount=1${where}${orderBy};`;
            const jobs = (await this.jobsRepository.query(query)) as JobDto[];

            if (jobs && jobs.length > 0) {
                response.jobs = jobs.map<JobDto>((x) => {
                    const jobEntity = new Job();
                    jobEntity.fromDto(x);
                    const jobDto = jobEntity.toDto();
                    const jhId = (x as any)['jobsHistory_id'];
                    const jhDate = (x as any)['jobsHistory_date'];

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
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async createOrUpdate(job: JobDto): Promise<GetJobResponse> {
        const updateResponse = await super.createOrUpdate(job);

        if (updateResponse.success) {
            this.triggerPlanJobs();
        }

        updateResponse.isOnMainWorker = ApiMainHelpers.isMainWorker();

        return updateResponse;
    }

    public async init() {
        if (!ApiMainHelpers.isMainWorker()) {
            return;
        }

        if (PM2Helpers.enabled) {
            PM2Helpers.onPM2Data.subscribe((data) => {
                if (data.eventName === 'PlanJobs') {
                    // console.log('receive plan jobs ', ApiMainHelpers.isMainWorker());
                    this.planJobs();
                }
            });
        } else {
            RedisManager.onMessage('PlanJobs').subscribe(() => {
                this.planJobs();
            });
        }

        await this.createInitialJobsIfNeeded();
        await this.planJobs();
    }

    private async planJobs() {
        if (!ApiMainHelpers.isMainWorker()) {
            return;
        }

        console.log('replanning all jobs...');
        this.stopAllJobsAndClearRunningJobs();
        const getJobsResponse = await this.findAll({
            where: { enabled: true, cronPattern: Not(IsNull()) },
        });

        if (!getJobsResponse.success) {
            return;
        }

        for (const jobDto of getJobsResponse.jobs) {
            if (!jobDto.cronPattern) {
                continue;
            }

            const jobDesc = this.getJobDescription(jobDto);
            const job = new CronJob(jobDto.cronPattern, async () => {
                await this.executeJob(jobDto);
            });
            job.start();
            await this.appLogger.log('scheduling job ' + jobDesc + ' ...');
            this.runningJobs.push({ cronJobObject: job, jobId: jobDto.id });
        }
    }

    private getJobDescription(jobEntity: JobDto) {
        return ' "' + jobEntity.name + '" (id=' + jobEntity.id + ')';
    }

    private async executeJob(jobDto: JobDto) {
        let jobResponse: GenericResponse = new GenericResponse();
        const jobDesc = this.getJobDescription(jobDto);

        try {
            if (maintenanceMode) {
                jobResponse.success = true;
                return jobResponse;
            }

            const jobEntity = await this.getRepository().findOne({
                where: { id: jobDto.id },
                select: ['id', 'enabled'],
            });

            if (!jobEntity.enabled) {
                await this.appLogger.log(
                    'prevent running disabled job ' + jobDesc + ' ...',
                );
                jobResponse.success = true;
                return jobResponse;
            }

            if (!jobDto.modulePath) {
                throw new Error('You must specify module path !');
            }

            if (!jobDto.servicePath) {
                throw new Error('You must specify service path !');
            }
            // console.log("Log ~ file: jobs.service.ts:211 ~ JobsService ~ executeJob ~ will import", jobDto.modulePath, jobDto.moduleName);
            const importedModule = await import(jobDto.modulePath);
            // console.log("Log ~ file: jobs.service.ts:211 ~ JobsService ~ executeJob ~ imported", imported);
            if (!importedModule) {
                throw new Error(
                    'Module ' +
                        jobDto.modulePath +
                        ' not found - invalid path !',
                );
            }

            let moduleName = jobDto.moduleName;

            if (!moduleName) {
                moduleName = Object.keys(importedModule)?.[0];
            }

            if (!moduleName) {
                throw new Error('Module ' + jobDto.modulePath + ' not found !');
            }

            const moduleRef = await this.lazyModuleLoader.load(
                () => importedModule[moduleName],
            );
            // console.log("Log ~ file: jobs.service.ts:218 ~ JobsService ~ executeJob ~ moduleRef", moduleRef);
            if (!moduleRef) {
                throw new Error(
                    'Module ' +
                        moduleName +
                        ' not found : moduleRef undefined !',
                );
            }

            const importedService = await import(jobDto.servicePath);

            if (!importedService) {
                throw new Error(
                    'Service ' +
                        jobDto.servicePath +
                        ' not found - invalid path !',
                );
            }

            let serviceName = jobDto.applicationServiceName;

            if (!serviceName) {
                serviceName = Object.keys(importedService)?.[0];
            }

            if (!serviceName) {
                throw new Error(
                    'Service ' + jobDto.servicePath + ' not found !',
                );
            }

            const service = moduleRef.get(importedService[serviceName]);
            // console.log("Log ~ file: jobs.service.ts:211 ~ JobsService ~ executeJob ~ imported", imported);
            if (!service) {
                throw new Error(
                    'Service ' +
                        serviceName +
                        ' not found : service undefined !',
                );
            }
            //const lazyModuleLoader = app.get(LazyModuleLoader);
            //TODO  with lazy module loader
            // try {
            //     service = await this.moduleRef.resolve(jobDto.applicationServiceName, undefined, { strict: false });
            //     console.log("Log ~ file: jobs.service.ts:223 ~ JobsService ~ executeJob ~ service", service);

            // }
            // catch (errService1) {
            //     console.log("Log ~ file: jobs.service.ts:223 ~ JobsService ~ executeJob ~ errService1", errService1);

            // }
            // if (!service) {
            //     try {
            //         service = this.moduleRef.get(jobDto.applicationServiceName, { strict: false });
            //         console.log("Log ~ file: jobs.service.ts:223 ~ JobsService ~ executeJob ~ service", service);
            //     }
            //     catch (errService2) {
            //         console.log("Log ~ file: jobs.service.ts:223 ~ JobsService ~ executeJob ~ errService2", errService2);

            //     }
            // }
            // if (!service)
            //     throw new Error('Service ' + jobDto.applicationServiceName + ' not found !');
            const method = service[
                jobDto.methodName
            ] as () => Promise<GenericResponse>;

            if (typeof method !== 'function') {
                throw new Error(
                    'Unable to run job ' + jobDesc + ' -> no method found !',
                );
            }

            if (jobDto.logHistory) {
                await this.appLogger.log('Running job ' + jobDesc + ' ...');
            }

            const start = new Date();

            if (jobDto.logHistory) {
                await this.appLogger.log(
                    'calling job method ' + jobDto.methodName + ' ...',
                );
            }

            jobResponse = (await method.call(service)) as GenericResponse;

            if (jobDto.logHistory) {
                const end = new Date();
                const newJobHistory = new JobHistory();
                newJobHistory.date = new Date();
                newJobHistory.jobId = jobDto.id;
                newJobHistory.duration = end.getTime() - start.getTime();
                if (jobResponse) {
                    newJobHistory.result = JSON.stringify(jobResponse);
                }
                await this.jobHistoryRepository.save(newJobHistory);
            }
        } catch (err) {
            await this.appLogger.error('Unable to run job ' + jobDesc);
            jobResponse.handleError(err);
        }

        return jobResponse;
    }

    private triggerPlanJobs() {
        if (ApiMainHelpers.isMainWorker()) {
            this.planJobs();

            return;
        }

        if (PM2Helpers.enabled) {
            PM2Helpers.sendDataToAllAppProcesses(
                { eventName: 'PlanJobs' },
                true,
            );
        } else {
            RedisManager.send('PlanJobs');
        }
    }

    public async deleteJobs(jobIds: string[]) {
        const response = await super.delete(jobIds);

        if (response.success) {
            this.triggerPlanJobs();
        }

        return response;
    }

    public async triggerJob(jobId: string) {
        let response = new GenericResponse();

        try {
            const job = await this.jobsRepository.findOne({
                where: { id: jobId },
            });

            if (!job) {
                throw new AppError('triggerJob - job not found id=' + jobId);
            }

            response = await this.executeJob(job.toDto());
        } catch (err) {
            response.error = err;
        }

        return response;
    }

    public async deleteOldJobHistoryAndLogs() {
        let response = new GenericResponse();

        try {
            await this.appLogger.log('Main clean - Début du job');
            response = await this.deleteOldJobHistory();

            if (response.success) {
                const ok = await this.appLogger.cleanLogs();
                response.success = ok;
            }

            await FirebaseService.cleanOldConnections();
            await FirebaseService.cleanOldNotifications();
            await this.notificationsService.cleanOldNotifications();

            if (!Environment.PreserveFilesInTempDirectory) {
                await this.cleanOldFilesInTempDirectory();
            }
        } catch (err) {
            response.error = err;
        }

        await this.appLogger.log('Main clean - Fin du job');

        return response;
    }

    private async cleanOldFilesInTempDirectory() {
        let result = true;

        try {
            const now = new Date();
            let removeCounter = 0;
            const tempFolders = [
                Environment.UploadedFilesTempDirectory,
                Environment.PublicTempFolder,
            ];

            for (const tempFolder of tempFolders) {
                const filesInTempFolder = await FileHelpers.getFilesInFolder(
                    tempFolder,
                    { returnFullPath: true },
                );

                for (const fileFullPath of filesInTempFolder) {
                    const fileInfo = await FileHelpers.getFileInfo(
                        fileFullPath,
                    );
                    if (!fileInfo?.success || !fileInfo.data?.mtime) {
                        continue;
                    }

                    if (DateHelpers.daysDiff(fileInfo.data.mtime, now) > 30) {
                        // console.log('must remove file ', fileInfo.data.mtime, fileFullPath, DateHelpers.daysDiff(fileInfo.data.mtime, now));
                        await FileHelpers.removeFile(fileFullPath);
                        removeCounter++;
                    }
                }
            }

            await this.appLogger.log(
                'Suppression des fichiers temporaires terminée - nombre de fichiers supprimés ',
                removeCounter,
            );
        } catch (err) {
            result = false;
            await this.appLogger.error(
                'Erreur lors de la suppression des fichiers temporaires',
                err,
            );
        }

        return result;
    }

    private async deleteOldJobHistory() {
        const response = new GenericResponse();

        try {
            const maxHistory = 50;
            const jobs = await this.jobsRepository.find();
            const jhToRemove: string[] = [];

            for (const job of jobs) {
                const jhList = await this.jobHistoryRepository.find({
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
        } catch (err) {
            response.error = err;
        }

        return response;
    }

    private async createInitialJobsIfNeeded() {
        if (!ApiMainHelpers.isMainWorker()) {
            return;
        }

        for (const jobDto of GlobalInitialJobs) {
            let jobEntity = await this.jobsRepository.findOne({
                where: { id: jobDto.id },
            });

            if (jobEntity) {
                continue;
            }

            jobEntity = new Job();
            jobEntity.fromDto(jobDto);
            await this.jobsRepository.save(jobEntity);
        }
    }

    public stopAllJobsAndClearRunningJobs() {
        if (!this.runningJobs) {
            return;
        }

        for (const job of this.runningJobs) {
            job.cronJobObject.stop();
        }

        this.runningJobs = [];
    }

    public async stopDisabledJobs() {
        const getJobsResponse = await this.findAll({
            where: { enabled: false },
        });

        if (!getJobsResponse.success) {
            return;
        }

        for (const jobEntity of getJobsResponse.jobs) {
            const jobObjectWrapperIndex = this.runningJobs.findIndex(
                (x) => x.jobId === jobEntity.id,
            );

            if (jobObjectWrapperIndex !== -1) {
                this.runningJobs[jobObjectWrapperIndex].cronJobObject.stop();
                this.runningJobs.splice(jobObjectWrapperIndex, 1);
            }
        }
    }
}
