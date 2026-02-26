import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppRight } from '../entities/app-right.entity';
import {
    AppRightDto,
    GetAppRightResponse,
    GetAppRightsResponse,
} from '../models/dto/app-right-dto';
import { ApplicationBaseModelService } from './base-model.service';

@Injectable()
export class AppRightsService extends ApplicationBaseModelService<
    AppRight,
    AppRightDto,
    GetAppRightResponse,
    GetAppRightsResponse
> {
    constructor(
        @InjectRepository(AppRight)
        public readonly rightRepository: Repository<AppRight>,
    ) {
        super();
        this.modelOptions = {
            getManyResponse: GetAppRightsResponse,
            getOneResponse: GetAppRightResponse,
            getManyResponseField: 'appRights',
            getOneResponseField: 'appRight',
            repository: this.rightRepository,
            entity: AppRight,
        };
    }
}
