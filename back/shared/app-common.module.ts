import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferentialController } from '../controllers/referential.controller';
import { AppLanguage } from '../entities/app-language.entity';
import { AppType } from '../entities/app-type.entity';
import { AppValue } from '../entities/app-value.entity';
import { JwtSecretKey } from '../environment/constants';
import { UsersModule } from '../modules/users/users.module';
import { AuthToolsService } from '../services/auth-tools.service';
import { RolesGuard } from '../services/guards/roles-guard';
import { ReferentialService } from '../services/referential.service';
import { AppLogger } from '../services/tools/logger.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: JwtSecretKey,
            signOptions: {
                expiresIn: '3650d',
            },
        }),
        TypeOrmModule.forFeature([AppValue, AppType, AppLanguage]),
        forwardRef(() => UsersModule),
    ],
    controllers: [ReferentialController],
    providers: [ReferentialService, AppLogger, RolesGuard, AuthToolsService],
    exports: [
        JwtModule,
        ReferentialService,
        AppLogger,
        RolesGuard,
        AuthToolsService,
        UsersModule,
    ],
})
export class AppCommonModule {}
