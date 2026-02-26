import { AppLogger } from './services/tools/logger.service';
import { JobsService } from './modules/jobs/jobs.service';
import { DatabaseService } from './services/tools/database.service';
export declare class AppModule {
    private logger;
    private dbService;
    private jobsService;
    constructor(logger: AppLogger, dbService: DatabaseService, jobsService: JobsService);
    private init;
    private static normalizePort;
}
