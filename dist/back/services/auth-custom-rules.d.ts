import { JwtPayload } from '../../shared/jwt-payload';
import { RolesList } from '../../shared/shared-constants';
import { UserDto } from '../models/dto/user-dto';
export declare function AuthCustomRules(user: UserDto): void;
export declare const UserRelationsForLogin: string[];
export declare const userFieldsForLogin: string[];
export declare const userRolesRules: {
    roleToAdd: RolesList;
    allowedRoles: string[];
}[];
export declare const additionalUserFieldsForTokenPayloadFunction: (payload: JwtPayload, user: UserDto) => void;
