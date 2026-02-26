import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCommonModule } from '../../shared/app-common.module';
import { SocketModule } from '../../sockets/socket-module';
import { CandidatApplicationModule } from '../candidates-application/candidate-applications.module';
import { FileModule } from '../file/file.module';
import { AnonymousExchange } from './anonymous-exchange.entity';
import { AnonymousExchangesController } from './anonymous-exchanges.controller';
import { AnonymousExchangesService } from './anonymous-exchanges.service';

@Module({
    imports: [
        AppCommonModule,
        TypeOrmModule.forFeature([AnonymousExchange]),
        SocketModule,
        FileModule,
        CandidatApplicationModule,
    ],
    controllers: [AnonymousExchangesController],
    providers: [AnonymousExchangesService],
    exports: [AnonymousExchangesService],
})
export class AnonymousExchangeModule {}
