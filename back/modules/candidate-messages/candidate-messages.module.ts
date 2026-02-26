import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthToolsService } from '../../services/auth-tools.service';
import { AppCommonModule } from '../../shared/app-common.module';
import { SocketModule } from '../../sockets/socket-module';
import { CandidateModule } from '../candidates/candidates.module';
import { CandidateMessage } from './candidate-message.entity';
import { CandidateMessagesController } from './candidate-messages.controller';
import { CandidateMessagesService } from './candidate-messages.service';

@Module({
    imports: [
        AppCommonModule,
        TypeOrmModule.forFeature([CandidateMessage]),
        CandidateModule,
        SocketModule,
    ],
    controllers: [CandidateMessagesController],
    providers: [CandidateMessagesService, AuthToolsService],
    exports: [CandidateMessagesService],
})
export class CandidateMessagesModule {}
