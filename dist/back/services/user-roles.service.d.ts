import { Repository } from 'typeorm';
import { UserRole } from '../entities/user-role.entity';
import { GetUserRoleResponse, GetUserRolesResponse, UserRoleDto } from '../models/dto/user-role-dto';
import { ApplicationBaseModelService } from './base-model.service';
export declare class UserRoleService extends ApplicationBaseModelService<UserRole, UserRoleDto, GetUserRoleResponse, GetUserRolesResponse> {
    private readonly userRolesRepository;
    private userRolesList;
    constructor(userRolesRepository: Repository<UserRole>);
    createOrUpdate(dto: UserRoleDto): Promise<GetUserRoleResponse>;
    getAllUserRoles(): Promise<GetUserRolesResponse>;
    delete(ids: string[]): Promise<import("../models/responses/generic-response").GenericResponse>;
    archive(ids: string[]): Promise<import("../models/responses/generic-response").GenericResponse>;
}
