import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSearchResponse } from '../responses/base-search-responses';
import { GenericResponse } from '../responses/generic-response';
import { AppRightDto } from './app-right-dto';

export class UserRoleDto {
    @ApiPropertyOptional()
    id?: number;

    @ApiProperty()
    role: string;

    @ApiPropertyOptional({ type: () => AppRightDto, isArray: true })
    rights?: AppRightDto[];

    @ApiPropertyOptional()
    label?: string;

    @ApiProperty()
    enabled: boolean;
}

export class GetUserRoleResponse extends GenericResponse {
    @ApiProperty({ type: () => UserRoleDto })
    userRole: UserRoleDto = null;
}

export class GetUserRolesResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => UserRoleDto, isArray: true })
    userRoles: UserRoleDto[] = [];
}
