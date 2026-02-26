import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSearchResponse } from '../responses/base-search-responses';
import { GenericResponse } from '../responses/generic-response';
import { UserRoleDto } from './user-role-dto';

export class AppRightDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiProperty()
    code: string;

    @ApiPropertyOptional()
    label?: string;

    @ApiPropertyOptional({ type: () => UserRoleDto, isArray: true })
    roles?: UserRoleDto[];

    @ApiPropertyOptional()
    order?: number;
}

export class GetAppRightResponse extends GenericResponse {
    @ApiProperty({ type: () => AppRightDto })
    appRight: AppRightDto = null;
}

export class GetAppRightsResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => AppRightDto, isArray: true })
    appRights: AppRightDto[] = [];
}
