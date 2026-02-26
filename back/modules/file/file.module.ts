import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from '../../controllers/file.controller';
import { AppFile } from '../../entities/app-file.entity';
import { FileService } from '../../services/tools/file.service';

@Module({
    imports: [TypeOrmModule.forFeature([AppFile])],
    controllers: [FileController],
    providers: [FileService],
    exports: [FileService],
})
export class FileModule {}
