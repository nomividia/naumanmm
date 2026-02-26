import { Module } from '@nestjs/common';
import { AppCommonModule } from '../shared/app-common.module';
import { ApiSocketController } from './socket-controller';
import { SocketGateway } from './socket-gateway';

@Module({
    imports: [AppCommonModule],
    controllers: [ApiSocketController],
    providers: [SocketGateway],
    exports: [SocketGateway],
})
export class SocketModule {}
