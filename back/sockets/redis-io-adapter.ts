import { IoAdapter } from '@nestjs/platform-socket.io';
// import redisIoAdapter from 'socket.io-redis';

export class RedisIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: any): any {
        const redisIoAdapter = require('socket.io-redis');
        const redisAdapter = redisIoAdapter({ host: 'localhost', port: 6379 });
        const server = super.createIOServer(port, options);
        server.adapter(redisAdapter);
        return server;
    }
}
