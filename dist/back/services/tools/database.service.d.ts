import { AppRightsService } from '../app-rights.service';
import { ReferentialService } from '../referential.service';
import { UserRoleService } from '../user-roles.service';
import { UsersService } from '../users.service';
import { AppLogger } from './logger.service';
export declare class DatabaseService {
    private usersService;
    private userRoleService;
    private appRightsService;
    private referentialService;
    private logger;
    constructor(usersService: UsersService, userRoleService: UserRoleService, appRightsService: AppRightsService, referentialService: ReferentialService, logger: AppLogger);
    seedDatabase(): Promise<void>;
    private createNewJobs;
    private createRoles;
    private createAndAssociateRights;
    private insertTypes;
    private createDefaultTypes;
    private createDefaultLanguages;
    private createDefaultUsers;
    private createUser;
    private setInitialApplicationRights;
}
