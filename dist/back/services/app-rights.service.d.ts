import { Repository } from 'typeorm';
import { AppRight } from '../entities/app-right.entity';
import { AppRightDto, GetAppRightResponse, GetAppRightsResponse } from '../models/dto/app-right-dto';
import { ApplicationBaseModelService } from './base-model.service';
export declare class AppRightsService extends ApplicationBaseModelService<AppRight, AppRightDto, GetAppRightResponse, GetAppRightsResponse> {
    readonly rightRepository: Repository<AppRight>;
    constructor(rightRepository: Repository<AppRight>);
}
