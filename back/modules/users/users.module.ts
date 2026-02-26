import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    AppRightsController,
    UsersController,
    UsersRolesController,
} from '../../controllers/users.controller';
import { AppRight } from '../../entities/app-right.entity';
import { UserRole } from '../../entities/user-role.entity';
import { User } from '../../entities/user.entity';
import { AppRightsService } from '../../services/app-rights.service';
import { UserRoleService } from '../../services/user-roles.service';
import { UsersService } from '../../services/users.service';
import { AppCommonModule } from '../../shared/app-common.module';
import { CandidateModule } from '../candidates/candidates.module';
import { FileModule } from '../file/file.module';
import { JobOfferModule } from '../job-offers/job-offers.module';

@Module({
    imports: [
        forwardRef(() => AppCommonModule),
        TypeOrmModule.forFeature([User, UserRole, AppRight]),
        FileModule,
        JobOfferModule,
        forwardRef(() => CandidateModule),
    ],
    controllers: [UsersController, UsersRolesController, AppRightsController],
    providers: [UsersService, UserRoleService, AppRightsService],
    exports: [UsersService, UserRoleService, AppRightsService],
})
export class UsersModule {}
